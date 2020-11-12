exports.scope = async (user, Model, collection, next) => {
  let scope;
  switch (user.membership.status) {
    case true:
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
