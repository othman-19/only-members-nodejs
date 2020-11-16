const UserRouter = require('express').Router();
const userController = require('../controllers/userController');

// GET request for creating a record. NOTE This must come before routes that display user.
UserRouter.get('/create', userController.new);

// POST request for creating record.
UserRouter.post('/create', userController.validations, userController.create);

// DELETE request to delete record.
UserRouter.delete('/:id', userController.delete);

// GET request to update record.
UserRouter.get('/:id/update', userController.edit);

// POST request to update record.
UserRouter.post('/:id/update', userController.validations, userController.update);

// GET request for one record.
UserRouter.get('/:id', userController.show);

// GET request for list of all records.
UserRouter.get('/', userController.index);

module.exports = UserRouter;
