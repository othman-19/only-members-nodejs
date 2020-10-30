const express = require('express');

const router = express.Router();

/* GET users listing. */
// GET request for creating a user. NOTE This must come before routes that display user.
router.get('/user/create', user_controller.user_new);

// POST request for creating user.
router.post('/user/create', user_controller.user_create);

// GET request to delete user.
router.get('/user/:id/delete', user_controller.user_delete_get);

// POST request to delete user.
router.post('/user/:id/delete', user_controller.user_delete);

// GET request to update user.
router.get('/user/:id/update', user_controller.user_edit);

// POST request to update user.
router.post('/user/:id/update', user_controller.user_update);

// GET request for one user.
router.get('/user/:id', user_controller.user_show);

// GET request for list of all users.
router.get('/users', user_controller.user_index);

module.exports = router;
