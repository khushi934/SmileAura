const express = require('express');
const { registerUser, authUser, forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', authUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

module.exports = router;
