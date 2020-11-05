const express = require('express');

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

module.exports = router;
