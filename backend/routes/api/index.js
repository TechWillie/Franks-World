const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser } = require("../../utils/auth.js");
const messagesRouter = require('./messages.js');
const chatroomsRouter = require('./chatrooms.js');
const eventsRouter = require('./events.js');
const mediaRouter = require('./media.js');


// GET /api/restore-user


router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/messages', messagesRouter);

router.use("/chatrooms", chatroomsRouter)

router.use('/events', eventsRouter);

router.use('/media', mediaRouter);

router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });

router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);

  // GET /api/set-token-cookie
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

// GET /api/require-auth
const { requireAuth } = require('../../utils/auth.js');
router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);

module.exports = router;