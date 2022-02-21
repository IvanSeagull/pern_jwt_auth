const Router = require('express');
const router = new Router();
const { check } = require('express-validator');

const controller = require('../Controllers/authController');

// middleware for only authorized users
const authMiddleware = require('../middleware/authMiddleware');
// middleware for only admin users
const roleMiddleware = require('../middleware/roleMiddleware');

router.post(
  '/register',
  [
    check('username', 'Please enter username').notEmpty(),
    check('password', 'Password should be between 4 and 10').isLength(4, 10),
  ],
  controller.register,
);
router.post('/login', controller.login);
router.get('/users', roleMiddleware(1), controller.getUsers);

module.exports = router;
