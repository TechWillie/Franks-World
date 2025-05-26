const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { ValidationError } = require('sequelize');
const path = require('path');

const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

if (!isProduction) {
  app.use(cors());
}

app.use(
  helmet.crossOriginResourcePolicy({
    policy: 'cross-origin',
  })
);
// ✅ CSRF RESTORE ROUTE BEFORE csrf middleware
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && 'Lax',
      httpOnly: true,
    },
  })
);

// ✅ NOW apply CSRF protection middleware AFTER restore route
app.get('/api/csrf/restore', (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken);
  res.status(200).json({ 'XSRF-Token': csrfToken });
});




// --- Register API routes first ---
app.use(routes);

// --- Serve React static assets and catch-all in production ---
if (isProduction) {
  const distPath = path.resolve(__dirname, '../frontend/dist');

  // Serve static files (JS, CSS, images)
  app.use(express.static(distPath));

  // Catch-all *after* static: send index.html for non-file routes (React routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}


// Catch unhandled requests and forward to error handler
app.use((_req, _res, next) => {
  const err = new Error("Franks World resource couldn't be found.");
  err.title = 'Franks Data Not Found';
  err.errors = { message: "Franks Data couldn't be found." };
  err.status = 404;
  next(err);
});

// Process sequelize errors
app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = 'Sequelize Database Validation error';
    err.errors = errors;
  }
  next(err);
});

// General error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Franks World Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });
});

module.exports = app;
