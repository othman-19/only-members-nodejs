const UserRouter = require('express').UserRouter();

// GET request for creating a user. NOTE This must come before routes that display user.
UserRouter.get('/user/create', user_controller.user_new);

// POST request for creating user.
UserRouter.post('/user/create', user_controller.user_create);

// GET request to delete user.
UserRouter.get('/user/:id/delete', user_controller.user_delete_get);

// POST request to delete user.
UserRouter.post('/user/:id/delete', user_controller.user_delete);

// GET request to update user.
UserRouter.get('/user/:id/update', user_controller.user_edit);

// POST request to update user.
UserRouter.post('/user/:id/update', user_controller.user_update);

// GET request for one user.
UserRouter.get('/user/:id', user_controller.user_show);

// GET request for list of all users.
UserRouter.get('/users', user_controller.user_index);

module.exports = UserRouter;
