exports.authenticateMember = (req, res, next) => {
  if (!req.user.isMember) {
    return res.redirect(req.user.url);
  }
  return next();
};

exports.authenticateNotMember = (req, res, next) => {
  if (!req.user.isMember) {
    return next();
  }
  return res.redirect(req.user.url);
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
