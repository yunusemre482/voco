const { Router } = require('express');

const router = new Router();

const {
    getAllUsers,
    getUserById,
    deleteUserById,
    getUserProfile,
    updateMe
} = require('../controllers/user.controller')


router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUserById);
router.get('/me', getUserProfile);
router.put('/me', updateMe);

module.exports = router;

