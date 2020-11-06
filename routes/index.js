const express = require('express');
const userRoleController = require('../controllers/userRoleController');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'posts' });
});

/* GET login form. */
router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Log In' });
});
/* GET register form. */
router.get('/register', (req, res, next) => {
  res.redirect('users/create');
});

/* GET membership form. */
router.get('/membership', userRoleController.newMember);

/* Post membership form. */
router.post('/membership', userRoleController.createMember);

module.exports = router;
