const express = require('express');
const passport = require('passport');
const userRoleController = require('../controllers/userRoleController');
const authentications = require('../config/authentications');

const router = express.Router();

/* GET home page. */
router.get('/', authentications.checkAuthenticatedUser, (req, res, next) => {
  res.redirect('/posts');
});

/* GET login form. */
router.get('/login', authentications.checkNotAuthenticatedUser, (req, res, next) => {
  res.render('login', { title: 'Log In' });
});

router.post('/login', authentications.checkNotAuthenticatedUser,
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));
/* GET register form. */
router.get('/register', authentications.checkNotAuthenticatedUser, (req, res, next) => {
  res.redirect('users/create');
});

/* GET membership form. */
router.get('/membership', authentications.checkAuthenticatedUser, authentications.authenticateNotMember, userRoleController.newMember);

/* Post membership form. */
router.post('/membership', authentications.checkAuthenticatedUser, authentications.authenticateNotMember, userRoleController.createMember);

module.exports = router;
