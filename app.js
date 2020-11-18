const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const logger = require('morgan');
const mongoose = require('mongoose');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const cors = require('cors');
const helmet = require('helmet');
const initializePassport = require('./config/passport');
const { checkAuthenticatedUser } = require('./config/authentications');

require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

const app = express();
initializePassport(passport);

mongoose.connect(process.env.MONGO_DB, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected');
    console.log(`app listening on port ${process.env.PORT}!`);
  })
  .catch(err => {
    console.error(err);
  });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(flash());
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
  },
}));
const allowedOrigins = ['null', 'http://localhost:3000', 'http://myrapp.com'];
app.use(cors({
  origin(origin, callback) {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    console.log(origin);
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not '
                + 'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// view engine setup
app.use(layouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// eslint-disable-next-line consistent-return
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use('/', indexRouter);
app.use('/users', checkAuthenticatedUser, usersRouter);
app.use('/posts', checkAuthenticatedUser, postsRouter);

app.delete('/logout', checkAuthenticatedUser, (req, res) => {
  req.logOut();
  req.flash('info', 'You logged out');
  req.session.destroy(() => res.redirect('/'));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  if (req.app.get('env') === 'production') {
    res.status(400);
    res.render('404', { title: '404: File Not Found' });
  } else {
    next(createError(404));
  }
});

// error handler
app.use((err, req, res, next) => {
  if (req.app.get('env') === 'production') {
    res.status(500);
    res.render('500', { title: '500: Internal Server Error', err });
  } else {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;
