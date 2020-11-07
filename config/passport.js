const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const authenticateUser = async (email, password, done) => {
  try {
    const user = await User.findOne({ email }).exec;

    if (user === null) {
      return done(null, false, { message: 'No user with that email' });
    }

    if (await bcrypt.compare(password, user.password)) {
      return done(null, user);
    }

    return done(null, false, { message: 'Password incorrect' });
  } catch (err) {
    return done(err);
  }
};

passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err);
  }
});
