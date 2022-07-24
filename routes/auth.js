const router = require('express').Router();
// const User = require('../models/User');
const { registerUser, loginUser } = require('../controllers/saveUser');

router.post('/register', registerUser)
router.post('/login', loginUser)

module.exports = router