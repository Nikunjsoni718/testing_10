const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');

router.post('/register', userController.registerUser);
router.get('/search', requireAuth, userController.searchUsers);
router.get('/:id', requireAuth, userController.getUserProfile);

module.exports = router;
