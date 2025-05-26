const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
// const csrf = require('csurf');
// const csrfProtection = csrf({ cookie: true });
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
// const user = require('../../db/models/user');




const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide Frank a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide Frank a password.'),
  handleValidationErrors
];

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];



const router = express.Router();

//! Sign up
router.post(
    '/', validateSignup,
    async (req, res) => {
      const { firstName, lastName, email, password, username, bio } = req.body;
      const hashedPassword = await bcrypt.hashSync(password);
      const user = await User.create({ 
        firstName,
        lastName,
        email,
        username,
        hashedPassword,
        bio 
      });
  
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        bio: user.bio || null
      };
      console.log("The user:", safeUser);
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
  );


//! Log in
router.post(
  '/login',
  // validateLogin,
  async (req, res, next) => {
     console.log('BODY RECEIVED:', req.body);
    const { credential, password } = req.body;
    console.log("The request body:", req.body);
    
    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential
        }
      }
    });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      const err = new Error('Login to Franks World failed');
      err.status = 401;
      err.title = 'Franks world Login failed';
      err.errors = { credential: 'The provided credentials were invalid.' };
      return next(err);
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);
// ! Log out
router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);
//! GET session user if any
router.get(
  '/restore', restoreUser,
  (req, res) => {
    const { user } = req;
    if (user) {
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
      };
      return res.json({
        user: safeUser
      });
    } else return res.json({ user: null });
  }
);

module.exports = router;