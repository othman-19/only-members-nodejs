const async = require('async');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Post = require('../models/post');

