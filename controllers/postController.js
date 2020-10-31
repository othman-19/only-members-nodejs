const async = require('async');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const Post = require('../models/post');

exports.index = (req, res, next) => {
  Post.find({}, 'title')
    .populate('author')
    .exec((err, posts) => {
      if (err) {
        return next(err);
      }
      // Successful, so render
      return res.render('post/posts', { title: 'Posts List', posts });
    });
};

// Display detail page for a specific post.
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

// Display post create form on GET.
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


