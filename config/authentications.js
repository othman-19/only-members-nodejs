exports.checkAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('danger', 'Please login first!');
  return res.redirect('/login');
};

exports.checkNotAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash('danger', 'You are already logged in');
    return res.redirect('/posts');
  }
  return next();
};
