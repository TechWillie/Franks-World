// backend/routes/index.js
const express = require('express');
const path = require('path');
const router = express.Router();
const apiRouter = require('./api');

// Mount API routes
router.use('/api', apiRouter);

// Always available: CSRF restore route
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({ 'XSRF-Token': csrfToken });
});

// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static assets
  router.use(express.static(path.resolve(__dirname, '../../frontend/dist')));

  // Serve index.html at root
  router.get('/', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.sendFile(path.resolve(__dirname, '../../frontend/dist/index.html'));
  });

  // Serve index.html at all other non-API routes (React Router support)
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.sendFile(path.resolve(__dirname, '../../frontend/dist/index.html'));
  });
}

module.exports = router;
