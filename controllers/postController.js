const async = require('async');
const { body, validationResult } = require('express-validator');
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
      return res.render('posts', { title: 'Posts List', posts });
    });
};
