const { check, validationResult } = require('express-validator');
const Post = require('../models/post');
const { scope } = require('../config/authorisations');

exports.index = (req, res, next) => {
  Post.find({}, 'title text')
    .populate('author')
    // eslint-disable-next-line consistent-return
    .exec((err, posts) => {
      if (err) {
        return next(err);
      }
      scope(req.user, Post, posts, next)
        .then(posts => {
          if (!req.user.isMember()) {
            req.flash('info', 'You Should be a member te see messages author');
          }
          res.render('post/posts', { title: 'Messages List', posts });
        });
    });
};

// Display detail page for a specific record.
exports.show = (req, res, next) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      return next(err);
    }
    if (post === null) {
      // No results.
      const error = new Error('Post not found');
      error.status = 404;
      return next(error);
    }
    // Successful, so render.
    return res.render('post/show', {
      title: post.title,
      post,
    });
  })
    .populate('author')
    .exec();
};

// Display record create form on GET.
exports.new = (req, res, next) => res.render('post/form', { title: 'Create New Post' });

// Validate and sanitize fields.
exports.validations = [
  check('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  check('text', 'Text must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
];

// eslint-disable-next-line consistent-return
exports.create = (req, res, next) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  // Create a record object with escaped and trimmed data.
  const post = new Post({
    title: req.body.title,
    text: req.body.text,
    author: req.user,
  });

  if (!errors.isEmpty()) {
    // There are errors. Render form again with sanitized values/error messages.
    return res.render('post/form', {
      title: 'Create Post',
      post,
      errors: errors.array(),
    });
  }
  // Data from form is valid. Save record.
  post.save(err => {
    if (err) {
      if (err.name === 'ValidationError') {
        const { errors } = err;
        const fields = Object.keys(errors);
        const errorMessages = fields.map(field => ({ msg: `${field} ${errors[field].properties.message}` }));
        res.render('post/form', {
          title: 'Create Post',
          post,
          errors: errorMessages,
        });
      }
      return next(err);
    }
    // successful - redirect to new record url.
    req.flash('success', 'Message Created');
    return res.redirect('/posts');
  });
};

exports.delete = (req, res, next) => {
  Post.findByIdAndRemove(req.params.id, (err, post) => {
    if (err) {
      return next(err);
    }
    if (post === null) {
      // No results.
      req.flash('info', 'Message not found');
      res.redirect('/');
    }
    // record deleted. Redirect to index page.
    req.flash('success', 'Message Deleted');
    return res.redirect('/posts');
  });
};

exports.edit = (req, res, next) => {
  // Get record for form.
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      return next(err);
    }
    if (post === null) {
      // No results.
      const error = new Error('Record not found');
      error.status = 404;
      return next(err);
    }
    // Success.
    return res.render('post/form', {
      title: 'Update Post',
      post,
    });
  }).populate('author').exec();
};

exports.update = (req, res, next) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  // Create a record object with escaped and trimmed data.
  const post = new Post({
    title: req.body.title,
    text: req.body.text,
    _id: req.params.id,
  });

  if (!errors.isEmpty()) {
    // There are errors. Render the form again with sanitized values/error messages.
    res.render('post/form', {
      title: 'Update Post',
      post,
      errors: errors.array(),
    });
  } else {
    Post.findByIdAndUpdate(
      req.params.id,
      post,
      {},
      error => {
        if (error) {
          return next(error);
        }
        // Successful - redirect to record url.
        req.flash('success', 'Message Updated');
        return res.redirect('/posts');
      },
    );
  }
};
