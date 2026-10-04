const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');

// GOOD PATTERN: sensitive profile and search endpoints are gated
// behind authentication middleware.
router.get('/:id', requireAuth, userController.getUserProfile);
router.post('/register', userController.registerUser);
router.get('/search', requireAuth, userController.searchUsers);

module.exports = router;
