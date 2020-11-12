exports.isMember = (req, res, next) => {
  if (!req.user.isMember) {
    return res.redirect(req.user.url);
  }
  return next();
};

exports.isNotMember = (req, res, next) => {
  if (!req.user.isMember) {
    return next();
  }
  return res.redirect(req.user.url);
};

exports.isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.redirect(req.user.url);
  }
  return next();
};

exports.isNotAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return next();
  }
  return res.redirect(req.user.url);
};

exports.scope = async (user, Model, collection, next) => {
  let scope;
  switch (user.role) {
    case 'admin':
    case 'member':
      scope = collection;
      break;
    default:
      try {
        await Model.find({}, 'title text')
          .populate({
            path: 'author',
            match: { _id: { $eq: user._id } },
          })
        // eslint-disable-next-line consistent-return
          .exec()
          .then(posts => {
            scope = posts;
          });
      } catch (err) {
        return next(err);
      }
  }
  // console.log(scope);
  return scope;
};
