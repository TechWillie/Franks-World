const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');



const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
      const users = await User.findAll();
      res.json({ users });
    } catch (err) {
      next(err);
    }
  });
  

module.exports = router;