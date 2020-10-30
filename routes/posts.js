const PostRouter = require('express').PostRouter();

// GET request for creating a post. NOTE This must come before route that displays Genre (uses id).
PostRouter.get('/post/create', post_controller.post_new);

// POST request for creating post.
PostRouter.post('/post/create', post_controller.post_create);

// GET request to delete post.
PostRouter.get('/post/:id/delete', post_controller.post_delete_get);

// POST request to delete post.
PostRouter.post('/post/:id/delete', post_controller.post_delete);

// GET request to update post.
PostRouter.get('/post/:id/update', post_controller.post_edit);

// POST request to update post.
PostRouter.post('/post/:id/update', post_controller.post_update);

// GET request for one post.
PostRouter.get('/post/:id', post_controller.post_show);

// GET request for list of all posts.
PostRouter.get('/', post_controller.post_index);

module.exports = PostRouter;
