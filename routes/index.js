const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');
const roleController = require('../controllers/roleController');
const { checkAuthenticatedUser } = require('../config/authentications');
const { checkNotAuthenticatedUser } = require('../config/authentications');
const { isNotMember } = require('../config/authorisations');
const { isNotAdmin } = require('../config/authorisations');
const { roleValidations } = require('../controllers/roleController');

const router = express.Router();

/* GET home page. */
router.get('/', checkAuthenticatedUser, (req, res, next) => {
  res.redirect('/posts');
});

router.get('/docs', (req, res, next) => {
  res.render('README.ejs');
});

/* GET login form. */
router.get('/login', checkNotAuthenticatedUser, (req, res, next) => {
  res.render('login', { title: 'Log In' });
});

router.post('/login', checkNotAuthenticatedUser,
  passport.authenticate('local', {
    successRedirect: '/',
    successFlash: 'Welcome!',
    failureRedirect: '/login',
    failureFlash: true,
  }));
/* GET register form. */
router.get('/register', checkNotAuthenticatedUser, userController.new);
router.post('/register', checkNotAuthenticatedUser, userController.create);

/* GET role form. */
router.get('/member', checkAuthenticatedUser, isNotAdmin, isNotMember, roleController.newMember);
router.get('/admin', checkAuthenticatedUser, isNotAdmin, roleController.newAdmin);
/* Post role form. */
router.post('/member', checkAuthenticatedUser, isNotAdmin, isNotMember, roleValidations, roleController.createMember);
router.post('/admin', checkAuthenticatedUser, isNotAdmin, roleValidations, roleController.createAdmin);

module.exports = router;
