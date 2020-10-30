const async = require('async');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Post = require('../models/post');

// Display list of all users.
exports.index = (req, res, next) => {
  User.find({}, "full_name")
    .exec((err, userList) => {
      if (err) {
        return next(err);
      }
      // Successful, so render
      return res.render("user_list", {
        title: "Users List",
        userList,
      });
    });
};