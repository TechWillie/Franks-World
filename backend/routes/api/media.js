const express = require("express");
const router = express.Router();
const { Media, User, Event } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

// helper: infer mediaType from contentType if not provided
function inferMediaType(contentType) {
  if (!contentType) return "image"; // safe default
  if (contentType.startsWith("image/")) return "image";
  if (contentType.startsWith("video/")) return "video";
  return "image";
}

/**
 * GET /api/media
 * Optional filters:
 *  - ?eventId=123
 *  - ?userId=me   (current user)
 *  - ?userId=42   (admin style; you can restrict if you want)
 */
router.get("/", async (req, res) => {
  try {
    const where = {};

    if (req.query.eventId) where.eventId = req.query.eventId;

    if (req.query.userId) {
      if (req.query.userId === "me") {
        // if you want to require auth for this, add requireAuth middleware to this route
        // but we can also just ignore if not authed
        if (!req.user) return res.status(401).json({ error: "Authentication required" });
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
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/media/:id
router.get("/:id", async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);
    if (!media) return res.status(404).json({ error: "Media not found" });
    return res.json(media);
  } catch (error) {
    console.error("Error fetching media:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * POST /api/media
 * This is the endpoint your frontend should call after Firebase upload.
 * Expected body:
 * {
 *   eventId?: number,
 *   url: string,
 *   path: string,        // firebase storage path
 *   folder?: string,
 *   contentType?: string,
 *   size?: number,
 *   originalName?: string,
 *   mediaType?: "image" | "video"
 * }
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      eventId = null,
      url,
      path, // <-- client sends "path" from your UploadFile component
      folder = null,
      contentType = null,
      size = null,
      originalName = null,
      mediaType = null,
    } = req.body;

    if (!url || !path) {
      return res.status(400).json({ error: "url and path are required" });
    }

    // Optional: verify event exists if eventId provided
    if (eventId) {
      const event = await Event.findByPk(eventId);
      if (!event) return res.status(400).json({ error: "Invalid eventId" });
    }

    const created = await Media.create({
      userId: req.user.id,            // ✅ do NOT trust userId from req.body
      eventId,
      url,
      storagePath: path,              // ✅ map path -> storagePath
      folder,
      contentType,
      sizeBytes: Number.isFinite(+size) ? +size : null,
      originalName,
      mediaType: mediaType || inferMediaType(contentType),
    });

    return res.status(201).json(created);
  } catch (error) {
    console.error("Error creating media:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * PUT /api/media/:id
 * Usually you do NOT want to let users change url/path after upload,
 * but here's a safe version: only updates metadata, not storagePath/url unless you want it.
 */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);
    if (!media) return res.status(404).json({ error: "Media not found" });

    // ✅ Only owner can edit (adjust if you have admin)
    if (media.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const {
      eventId,
      folder,
      contentType,
      size,
      originalName,
      mediaType,
      // If you WANT to allow updating url/path, uncomment these:
      // url,
      // path,
    } = req.body;

    if (eventId !== undefined) media.eventId = eventId;
    if (folder !== undefined) media.folder = folder;
    if (contentType !== undefined) media.contentType = contentType;
    if (size !== undefined) media.sizeBytes = Number.isFinite(+size) ? +size : null;
    if (originalName !== undefined) media.originalName = originalName;
    if (mediaType !== undefined) media.mediaType = mediaType;

    // if (url !== undefined) media.url = url;
    // if (path !== undefined) media.storagePath = path;

    await media.save();
    return res.json(media);
  } catch (error) {
    console.error("Error updating media:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /api/media/:id
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);
    if (!media) return res.status(404).json({ error: "Media not found" });

    // ✅ Only owner can delete
    if (media.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await media.destroy();
    return res.json({ message: "Media deleted successfully" });
  } catch (error) {
    console.error("Error deleting media:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

