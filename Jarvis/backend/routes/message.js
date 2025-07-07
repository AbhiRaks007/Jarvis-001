const express = require('express');
const router = express.Router();
const { handleMessage } = require('../controllers/messageController');

// POST /api/message
router.post('/', handleMessage);

module.exports = router;
