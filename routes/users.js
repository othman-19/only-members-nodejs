const UserRouter = require('express').UserRouter();

const userController = require('../controllers/userController');

// GET request for creating a user. NOTE This must come before routes that display user.
UserRouter.get('/user/create', userController.new);

// POST request for creating user.
UserRouter.post('/user/create', userController.create);

// DELETE request to delete user.
UserRouter.delete('/user/:id', userController.delete);

// GET request to update user.
UserRouter.get('/user/:id/update', userController.edit);

// POST request to update user.
UserRouter.post('/user/:id/update', userController.update);

// GET request for one user.
UserRouter.get('/user/:id', userController.show);

// GET request for list of all users.
UserRouter.get('/users', userController.index);

module.exports = UserRouter;
