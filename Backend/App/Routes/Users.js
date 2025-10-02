const router = require('express').Router();
const auth = require('../Middleware/auth');
const {
    AddUser,
    getUser,
    updateUser,
    deleteUser,
    detailUser,
    loginUser,
    statusChange,
    updateUserPermissions,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    activeUser
} = require('../Controllers/Users');

// Public routes
router.post('/user/login', loginUser);
router.post('/user/forgot-password', forgotPassword);
router.post('/user/reset-password', resetPassword);

// Protected routes
router.post('/user/add', auth, AddUser);
router.get('/user/list', auth, getUser);
router.put('/user/update', auth, updateUser);
router.get('/user/delete/:id', auth, deleteUser);
router.get('/user/detail/:id', auth, detailUser);
router.post('/user/change-status', auth, statusChange);
router.post('/user/update-permissions', auth, updateUserPermissions);
router.post('/user/change-password', auth, changePassword);
router.post('/user/update-profile',  updateProfile);
router.get('/user/activeuser', auth, activeUser);

module.exports = router;
