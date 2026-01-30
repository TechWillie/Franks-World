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

//! GET /api/media/:id
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


// ! Create new media
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      eventId = null,
      url,
      storagePath, // <-- client sends "path" from your UploadFile component
      folder = null,
      contentType = null,
      sizeBytes = null,
      originalName = null,
      mediaType = null,
    } = req.body;

    if (!url || !storagePath) {
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
      storagePath,          
      folder,
      contentType,
      sizeBytes: Number.isFinite(+sizeBytes) ? +sizeBytes : null,
      originalName,
      mediaType: mediaType || inferMediaType(contentType),
    });

    return res.status(201).json(created);
  } catch (error) {
    console.error("Error creating media:", error);
    return res.status(500).json({ error: "new media Internal Server Error" });
  }
});

// !! Add photo to user
router.put("/me/photo", requireAuth, async (req, res) => {
  const { url } = req.body;

  const user = await User.findByPk(req.user.id);

  if (!user) return res.status(404).json({ error: "User not found" });

  user.photo = url;
  await user.save();

  return res.json(user);
});



// ! Update media
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
      sizeBytes,
      originalName,
      mediaType,
      // If you WANT to allow updating url/path, uncomment these:
      // url,
      // path,
    } = req.body;

    if (eventId !== undefined) media.eventId = eventId;
    if (folder !== undefined) media.folder = folder;
    if (contentType !== undefined) media.contentType = contentType;
    if (sizeBytes !== undefined) media.sizeBytes = Number.isFinite(+sizeBytes) ? +sizeBytes : null;
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

//! DELETE /api/media/:id
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

