const express = require('express');
const passport = require('passport');
const userRoleController = require('../controllers/userRoleController');

const { checkAuthenticatedUser } = require('../config/authentications');
const { checkNotAuthenticatedUser } = require('../config/authentications');
const { isNotMember } = require('../config/authorisations');

const router = express.Router();

/* GET home page. */
router.get('/', checkAuthenticatedUser, (req, res, next) => {
  res.redirect('/posts');
});

/* GET login form. */
router.get('/login', checkNotAuthenticatedUser, (req, res, next) => {
  res.render('login', { title: 'Log In' });
});

router.post('/login', checkNotAuthenticatedUser,
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));
/* GET register form. */
router.get('/register', checkNotAuthenticatedUser, (req, res, next) => {
  res.redirect('users/create');
});

/* GET membership form. */
router.get('/membership', checkAuthenticatedUser, isNotMember, userRoleController.newMember);

/* Post membership form. */
router.post('/membership', checkAuthenticatedUser, isNotMember, userRoleController.createMember);

module.exports = router;
