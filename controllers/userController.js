const async = require('async');
const { body, validationResult } = require('express-validator');
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
