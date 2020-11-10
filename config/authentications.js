exports.authenticateMembership = (req, res, next) => {
  if (!req.user.isMember) {
    return res.redirect('user/membershipForm');
  }
  return next();
};

exports.checkAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
};

exports.checkNotAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return next();
};
