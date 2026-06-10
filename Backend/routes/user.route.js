const express = require('express');
const { getUserProfile } = require('../controller/user.controller');

const { addUserAddress } = require('../controller/user.controller');

const router = express.Router();

router.post('/user/address', addUserAddress); // Route to add user address


router.get('/user/:userId', getUserProfile); // Route to get user profile data

module.exports = router;
