const async = require('async');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const Post = require('../models/post');

// Display list of all users.
exports.index = (req, res, next) => {
  User.find({}, 'full_name')
    .exec((err, userList) => {
      if (err) {
        return next(err);
      }
      // Successful, so render
      return res.render('user_list', {
        title: 'Users List',
        userList,
      });
    });
};

// Display detail page for a specific user.
exports.show = (req, res, next) => {
  async.parallel(
    {
      user(callback) {
        User.findById(req.params.id).exec(callback);
      },

      userPosts(callback) {
        Post.find({ author: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.user === null) {
        // No results.
        const error = new Error('User not found');
        error.status = 404;
        return next(error);
      }
      // Successful, so render
      return res.render('/user/show', {
        title: 'User Detail',
        user: results.user,
        userPosts: results.userPosts,
      });
    },
  );
};

// Display user new form.
exports.new = (req, res, next) => {
  res.render('user/form', { title: 'Create New User' });
};

exports.validations = [
  check('user_name', 'Username Must Be an Email Address')
    .trim()
    .notEmpty()
    .escape(),

  check('first_name', 'First name required')
    .trim()
    .notEmpty()
    .escape(),

  check('last_name', 'Last name required')
    .trim()
    .notEmpty()
    .escape(),

  check('email', 'Valid email is required')
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),

  check('password')
    .isLength({ min: 8 })
    .withMessage('Password Must Be at Least 8 Characters')
    .matches('[0-9]')
    .withMessage('Password Must Contain a Number')
    .matches('[A-Z]')
    .withMessage('Password Must Contain an Uppercase Letter')
    .trim()
    .escape(),
];
