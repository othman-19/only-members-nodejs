const async = require('async');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const Post = require('../models/post');

// Display list of all records.
exports.index = (req, res, next) => {
  User.find({}, 'user_name full_name')
    .exec((err, users) => {
      if (err) {
        return next(err);
      }
      // Successful, so render
      return res.render('user/users', {
        title: 'Users List',
        users,
      });
    });
};

// Display detail page for a specific record.
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

// Display record new form.
exports.new = (req, res, next) => res.render('user/form', { title: 'Create New User' });

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

exports.create = (req, res, next) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  // Create a record object with validated data.
  let user = new User({
    user_name: req.body.user_name,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    hash: req.body.password,
  });

  if (!errors.isEmpty()) {
    // There are errors. Render the form again with sanitized values/error messages.
    res.render('user/form', {
      title: 'Create User',
      user,
      errors: errors.array(),
    });
  } else {
    // Data from form is valid.
    // eslint-disable-next-line consistent-return
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      user = new User({
        user_name: req.body.user_name,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        hash: hashedPassword,
      }).save(err => {
        if (err) {
          return next(err);
        }
        // record saved. Redirect to record url.
        return res.redirect(user.url);
      });
    });
  }
};

exports.delete = (req, res, next) => {
  User.findByIdAndRemove(req.params.id, err => {
    if (err) {
      return next(err);
    }
    // record deleted. Redirect to index page.
    return res.redirect('/');
  });
};

// Display record edit form.
exports.edit = (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user === null) {
      return res.redirect('/');
    }
    return res.render('user/form', {
      title: 'Update User',
      user,
    });
  }).exec();
};

exports.update = (req, res, next) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  // Create a record object with escaped and trimmed data.
  let user = new User({
    user_name: req.body.user_name,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    hash: req.body.password,
  });

  if (!errors.isEmpty()) {
    // There are errors. Render the form again with sanitized values/error messages.
    res.render('user/form', {
      title: 'Update User',
      user,
      errors: errors.array(),
    });
  } else {
    // Data from form is valid.
    // eslint-disable-next-line consistent-return
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      user = new User({
        user_name: req.body.user_name,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        hash: hashedPassword,
        _id: req.params.id,
      });
      User.findByIdAndUpdate(
        req.params.id,
        user,
        {},
        (error, updatedUser) => {
          if (error) {
            return next(error);
          }
          // Successful - redirect to record url.
          return res.redirect(updatedUser.url);
        },
      );
    });
  }
};
