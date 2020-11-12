const express = require('express');
const passport = require('passport');
const userRoleController = require('../controllers/roleController');

const { checkAuthenticatedUser } = require('../config/authentications');
const { checkNotAuthenticatedUser } = require('../config/authentications');
const { isNotMember } = require('../config/authorisations');
const { isNotAdmin } = require('../config/authorisations');

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

/* GET role form. */
router.get('/member', checkAuthenticatedUser, isNotMember, userRoleController.newMember);
router.get('/admin', checkAuthenticatedUser, isNotAdmin, userRoleController.newAdmin);
/* Post role form. */
router.post('/member', checkAuthenticatedUser, isNotMember, userRoleController.createMember);
router.post('/admin', checkAuthenticatedUser, isNotAdmin, userRoleController.createAdmin);

module.exports = router;
