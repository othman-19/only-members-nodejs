const PostRouter = require('express').Router();
const postController = require('../controllers/postController');
const authentications = require('../config/authentications');

// authenticate before any action
PostRouter.all('*', authentications.checkAuthenticatedUser);
// GET request for creating a record.
// NOTE This must come before route that displays Genre (uses id).

PostRouter.get('/create', postController.new);

// POST request for creating record.
PostRouter.post('/create', postController.validations, postController.create);

// POST request to delete record.
PostRouter.delete('/:id/delete', postController.delete);

// GET request to update record.
PostRouter.get('/:id/update', postController.edit);

// POST request to update record.
PostRouter.post('/:id/update', postController.validations, postController.update);

// GET request for one record.
PostRouter.get('/:id', postController.show);

// GET request for list of all records.
PostRouter.get('/', postController.index);

module.exports = PostRouter;
