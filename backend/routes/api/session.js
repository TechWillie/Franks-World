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
      const { firstName, lastName, email, password, username, bio = null } = req.body;
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
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio || null,
        photo: user.photo || null,
      };

      console.log("The user:", safeUser);
      await setTokenCookie(res, user);
  
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
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio || null,
      photo: user.photo || null,
    };


    await setTokenCookie(res, user);

    return res.json({
      user: safeUser
    });
  }
);

// ! Logout
router.delete('/', (_req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    path: '/', // important if you set it
  });

  return res.json({ message: 'success' });
});

//! GET session user if any
router.get("/restore", restoreUser, async (req, res) => {
  try {
    if (!req.user) return res.json({ user: null });

    const freshUser = await User.findByPk(req.user.id);

    // ✅ KEY FIX: user was deleted but cookie still exists
    if (!freshUser) {
      // optional but recommended: kill the bad cookie
      res.clearCookie("token");
      return res.json({ user: null });
    }

    const safeUser = {
      id: freshUser.id,
      email: freshUser.email,
      username: freshUser.username,
      firstName: freshUser.firstName,
      lastName: freshUser.lastName,
      bio: freshUser.bio || null,
      photo: freshUser.photo || null,
    };

    return res.json({ user: safeUser });
  } catch (err) {
    console.error("❌ /restore crashed:", err);
    res.clearCookie("token"); // optional safety
    return res.json({ user: null }); // ✅ never 500 here
  }
});



router.post("/demouser", async (req, res) => {
  const { email, username, password } = req.body;
  const user = await User.create({
    email,
    username,
    hashedPassword: bcrypt.hashSync(password),
  });
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    photo: user.photo || null,
  };

  await setTokenCookie(res, user);
  return res.json({
    user: safeUser,
  });
});

module.exports = router;