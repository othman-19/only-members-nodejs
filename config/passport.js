const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const initializePassport = passport => {
  const authenticateUser = async (email, password, done) => {
    let user;
    try {
      await User.findOne({ email })
        .exec()
        .then(doc => { user = doc; });
      // .catch(err => done(err));

      if (user === null) {
        return done(null, false, { message: 'No user with that email' });
      }

      if (await bcrypt.compare(password, user.hash)) {
        return done(null, user);
      }
      return done(null, false, { message: 'Password incorrect' });
    } catch (err) {
      return done(err);
    }
  };
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      authenticateUser,
    ),
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};

module.exports = initializePassport;
