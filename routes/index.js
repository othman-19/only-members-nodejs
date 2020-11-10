const express = require('express');
const passport = require('passport');
const userRoleController = require('../controllers/userRoleController');
const authentications = require('../config/authentications');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'posts' });
});

/* GET login form. */
router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Log In' });
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));
/* GET register form. */
router.get('/register', (req, res, next) => {
  res.redirect('users/create');
});

/* GET membership form. */
router.get('/membership', authentications.authenticateNotMember, userRoleController.newMember);

/* Post membership form. */
router.post('/membership', authentications.authenticateNotMember, userRoleController.createMember);

module.exports = router;
