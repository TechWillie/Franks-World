// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// This function will be used in the login and signup routes 
// to set the token cookie
// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    const token = jwt.sign(
      { data: safeUser },
      secret,
      { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );
  
    const isProduction = process.env.NODE_ENV === "production";
  
    // Set the token cookie
    res.cookie('token', token, {
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction && "Lax"
    });
  
    return token;
  };


  // This function will be used in the login and signup routes
  // to set the token cookie
  const restoreUser = (req, res, next) => {
    // The restoreUser middleware will be connected to the API router 
    // so that all API route handlers will check if there is a current user logged in or not.
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;
  
    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {
        return next();
      }
  
      try {
        const { id } = jwtPayload.data;
        req.user = await User.findByPk(id, {
          attributes: {
            include: ['email', 'createdAt', 'updatedAt']
          }
        });
      } catch (e) {
        res.clearCookie('token');
        return next();
      }
  
      if (!req.user) res.clearCookie('token');
  
      return next();
    });
  };

  // If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();
    // requireAuth will be connected directly to route handlers 
    // where there needs to be a current user logged in for the actions in those route handlers.
  
    const err = new Error('Franks World Authentication required');
    err.title = 'Franks World Authentication required';
    err.errors = { message: 'Franks World Authentication required' };
    err.status = 401;
    return next(err);
  }


  module.exports = { setTokenCookie, restoreUser, requireAuth };