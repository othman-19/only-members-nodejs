const async = require('async');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const Post = require('../models/post');

// Display list of all records.
exports.index = (req, res, next) => {
  User.find({}, 'userName fullName')
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
      return res.render('user/show', {
        title: 'User Detail',
        user: results.user,
        posts: results.userPosts,
      });
    },
  );
};

// Display record new form.
exports.new = (req, res, next) => res.render('user/form', { title: 'Create New User' });

exports.validations = [
  check('userName', 'Username required')
    .trim()
    .notEmpty()
    .escape(),

  check('firstName', 'First name required')
    .trim()
    .notEmpty()
    .escape(),

  check('lastName', 'Last name required')
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

  check('passwordConfirmation', 'passwordConfirmation field must have the same value as the password field')
    .exists()
    .custom((value, { req }) => value === req.body.password),
];

// eslint-disable-next-line consistent-return
exports.create = (req, res, next) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  // Create a record object with validated data.
  let user = {
    userName: req.body.userName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
  };

  if (!errors.isEmpty()) {
    // There are errors. Render the form again with sanitized values/error messages.
    return res.render('user/form', {
      title: 'Create User',
      user,
      errors: errors.array(),
    });
  }
  // Data from form is valid.
  // eslint-disable-next-line consistent-return
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    user = new User({
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      hash: hashedPassword,
    });
    user.save(err => {
      if (err) {
        if (err.name === 'ValidationError') {
          const { errors } = err;
          const fields = Object.keys(errors);
          const errorMessages = fields.map(field => ({ msg: `${field} ${errors[field].properties.message}` }));
          return res.render('user/form', {
            title: 'Create User',
            user,
            errors: errorMessages,
          });
        }
        // return next(err);
      }
      // record saved. Redirect to record url.
      req.flash('success', 'Congratulation you are registred');
      return res.redirect('/login');
    });
  });
};

exports.delete = (req, res, next) => {
  async.waterfall([
    callback => {
      User.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) {
          return next(err);
        }
        if (user === null) {
          // No results.
          return res.redirect(`/users/${req.body.userid}`);
        }
        return user;
      });
      callback(null, req.params.id);
    },
    (arg1, callback) => {
      Post.remove({ author: mongoose.Types.ObjectId(arg1) },
        (err, docs) => {
          if (err) {
            return next(err);
          }
          return docs;
        });
      callback(null, req.params.id);
    },
  ],
  (err, result) => {
    if (err) {
      return next(err);
    }
    // records deleted. Redirect to index page.
    req.flash('success', 'User Deleted');
    return res.redirect('/login');
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
  });
};

// eslint-disable-next-line consistent-return
exports.update = (req, res, next) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  // Create a record object with escaped and trimmed data.
  let user = {
    userName: req.body.userName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    hash: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
  };

  if (!errors.isEmpty()) {
    // There are errors. Render the form again with sanitized values/error messages.
    console.log('here');
    return res.render('user/form', {
      title: 'Update User',
      user,
      errors: errors.array(),
    });
  }
  // Data from form is valid.
  // eslint-disable-next-line consistent-return
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    user = new User({
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
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
        req.flash('success', 'User Updated');
        return res.redirect('/');
      },
    );
  });
};
