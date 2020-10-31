const UserRouter = require('express').UserRouter();

const userController = require('../controllers/userController');

// GET request for creating a record. NOTE This must come before routes that display user.
UserRouter.get('/user/create', userController.new);

// POST request for creating record.
UserRouter.post('/user/create', userController.create);

// DELETE request to delete record.
UserRouter.delete('/user/:id', userController.delete);

// GET request to update record.
UserRouter.get('/user/:id/update', userController.edit);

// POST request to update record.
UserRouter.post('/user/:id/update', userController.update);

// GET request for one record.
UserRouter.get('/user/:id', userController.show);

// GET request for list of all records.
UserRouter.get('/users', userController.index);

module.exports = UserRouter;
