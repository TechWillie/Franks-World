const express = require("express");
const multer = require("multer");
const { randomUUID } = require("crypto");

const router = express.Router();

const { Media, User, Event } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { firebaseBucket } = require("../../config/firebaseAdmin");

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      return callback(
        new multer.MulterError(
          "LIMIT_UNEXPECTED_FILE",
          "Only JPG, PNG, WEBP, and GIF images are allowed."
        )
      );
    }

    callback(null, true);
  },
});

function inferMediaType(contentType) {
  if (!contentType) return "image";
  if (contentType.startsWith("image/")) return "image";
  if (contentType.startsWith("video/")) return "video";
  return "image";
}

function sanitizeFileName(fileName = "image") {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 120);
}

function runSingleFileUpload(req, res) {
  return new Promise((resolve, reject) => {
    upload.single("file")(req, res, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function buildFirebaseDownloadUrl({
  bucketName,
  storagePath,
  downloadToken,
}) {
  const encodedBucket = encodeURIComponent(bucketName);
  const encodedPath = encodeURIComponent(storagePath);

  return (
    `https://firebasestorage.googleapis.com/v0/b/${encodedBucket}` +
    `/o/${encodedPath}?alt=media&token=${downloadToken}`
  );
}

/**
 * GET /api/media
 * Optional filters:
 * - ?eventId=123
 * - ?userId=me
 * - ?userId=42
 */
router.get("/", async (req, res) => {
  try {
    const where = {};

    if (req.query.eventId) {
      where.eventId = req.query.eventId;
    }

    if (req.query.userId) {
      if (req.query.userId === "me") {
        if (!req.user) {
          return res.status(401).json({
            error: "Authentication required",
          });
        }

        where.userId = req.user.id;
      } else {
        where.userId = req.query.userId;
      }
    }

    const media = await Media.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return res.json(media);
  } catch (error) {
    console.error("Error fetching media:", error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

/**
 * POST /api/media/upload
 *
 * multipart/form-data fields:
 * - file: selected image
 * - eventId: optional event ID
 */
router.post("/upload", requireAuth, async (req, res) => {
  let uploadedStorageFile = null;

  try {
    await runSingleFileUpload(req, res);

    if (!req.file) {
      return res.status(400).json({
        error: "An image file is required.",
      });
    }

    const eventIdValue = req.body.eventId;

    const eventId =
      eventIdValue === undefined ||
      eventIdValue === null ||
      eventIdValue === ""
        ? null
        : Number(eventIdValue);

    if (
      eventId !== null &&
      (!Number.isInteger(eventId) || eventId <= 0)
    ) {
      return res.status(400).json({
        error: "eventId must be a valid positive integer.",
      });
    }

    if (eventId !== null) {
      const event = await Event.findByPk(eventId);

      if (!event) {
        return res.status(404).json({
          error: "Event not found.",
        });
      }

      if (event.hostId !== req.user.id) {
        return res.status(403).json({
          error: "You cannot upload media for another user's event.",
        });
      }
    }

    const originalName = sanitizeFileName(
      req.file.originalname
    );

    const fileExtension = originalName.includes(".")
      ? originalName.substring(
          originalName.lastIndexOf(".")
        )
      : "";

    const folder =
      eventId !== null
        ? `events/${req.user.id}`
        : `users/${req.user.id}/images`;

    const storagePath =
      `${folder}/${Date.now()}-${randomUUID()}` +
      fileExtension;

    const downloadToken = randomUUID();

    uploadedStorageFile = firebaseBucket.file(storagePath);

    await uploadedStorageFile.save(req.file.buffer, {
      resumable: false,
      metadata: {
        contentType: req.file.mimetype,
        cacheControl:
          "public, max-age=31536000, immutable",
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
          uploadedByUserId: String(req.user.id),
          eventId:
            eventId === null ? "" : String(eventId),
          originalName,
        },
      },
    });

    const url = buildFirebaseDownloadUrl({
      bucketName: firebaseBucket.name,
      storagePath,
      downloadToken,
    });

    const createdMedia = await Media.create({
      userId: req.user.id,
      eventId,
      url,
      storagePath,
      folder,
      contentType: req.file.mimetype,
      sizeBytes: req.file.size,
      originalName,
      mediaType: inferMediaType(req.file.mimetype),
    });

    return res.status(201).json(createdMedia);
  } catch (error) {
    console.error("Secure media upload failed:", error);

    if (uploadedStorageFile) {
      try {
        await uploadedStorageFile.delete({
          ignoreNotFound: true,
        });
      } catch (cleanupError) {
        console.error(
          "Failed to remove orphaned Firebase file:",
          cleanupError
        );
      }
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          error: "The image exceeds the 10 MB size limit.",
        });
      }

      return res.status(400).json({
        error:
          error.field ||
          error.message ||
          "The uploaded file is invalid.",
      });
    }

    return res.status(500).json({
      error: "The image could not be uploaded.",
    });
  }
});

/**
 * GET /api/media/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);

    if (!media) {
      return res.status(404).json({
        error: "Media not found",
      });
    }

    return res.json(media);
  } catch (error) {
    console.error("Error fetching media:", error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

/**
 * POST /api/media
 *
 * Legacy metadata-only route.
 * Keep temporarily for mobile compatibility.
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      eventId = null,
      url,
      storagePath,
      folder = null,
      contentType = null,
      sizeBytes = null,
      originalName = null,
      mediaType = null,
    } = req.body;

    if (!url || !storagePath) {
      return res.status(400).json({
        error: "url and storagePath are required",
      });
    }

    if (eventId) {
      const event = await Event.findByPk(eventId);

      if (!event) {
        return res.status(400).json({
          error: "Invalid eventId",
        });
      }

      if (event.hostId !== req.user.id) {
        return res.status(403).json({
          error: "You cannot add media to another user's event.",
        });
      }
    }

    const created = await Media.create({
      userId: req.user.id,
      eventId,
      url,
      storagePath,
      folder,
      contentType,
      sizeBytes: Number.isFinite(+sizeBytes)
        ? +sizeBytes
        : null,
      originalName,
      mediaType:
        mediaType || inferMediaType(contentType),
    });

    return res.status(201).json(created);
  } catch (error) {
    console.error("Error creating media:", error);

    return res.status(500).json({
      error: "New media Internal Server Error",
    });
  }
});

/**
 * PUT /api/media/me/photo
 */
router.put("/me/photo", requireAuth, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "A photo URL is required.",
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    user.photo = url;
    await user.save();

    return res.json(user);
  } catch (error) {
    console.error("Error updating profile photo:", error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

/**
 * PUT /api/media/:id
 */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);

    if (!media) {
      return res.status(404).json({
        error: "Media not found",
      });
    }

    if (media.userId !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    const {
      eventId,
      folder,
      contentType,
      sizeBytes,
      originalName,
      mediaType,
    } = req.body;

    if (eventId !== undefined) {
      media.eventId = eventId;
    }

    if (folder !== undefined) {
      media.folder = folder;
    }

    if (contentType !== undefined) {
      media.contentType = contentType;
    }

    if (sizeBytes !== undefined) {
      media.sizeBytes = Number.isFinite(+sizeBytes)
        ? +sizeBytes
        : null;
    }

    if (originalName !== undefined) {
      media.originalName = originalName;
    }

    if (mediaType !== undefined) {
      media.mediaType = mediaType;
    }

    await media.save();

    return res.json(media);
  } catch (error) {
    console.error("Error updating media:", error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

/**
 * DELETE /api/media/:id
 */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);

    if (!media) {
      return res.status(404).json({
        error: "Media not found",
      });
    }

    if (media.userId !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    await media.destroy();

    return res.json({
      message: "Media deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting media:", error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

module.exports = router;