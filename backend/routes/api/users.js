const express = require('express')
const bcrypt = require('bcryptjs');
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');





  //! Get all users
  router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    const plainUsersArr = users.map(user => user.toJSON());
    // console.log(plainUsersArr); // Log the plain users array
    return res.json(plainUsersArr); 
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

//! Get a user by ID
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  return res.json(user);
});

// ! Add the pic if uploaded
router.put("/me/photo", requireAuth, async (req, res) => {
  // console.log("🔥 HIT /api/users/me/photo" ,{userId: req.user?.id,body: req.body,});

  const { photo } = req.body;

  if (!photo) {
    return res.status(400).json({ error: "A picture is required" });
  }

  req.user.photo = photo;
  await req.user.save();

  return res.json({
    id: req.user.id,
    username: req.user.username,
    photo: req.user.photo,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    bio: req.user.bio
  });
});


module.exports = router;

