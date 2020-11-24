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
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
const debug = require('debug')('members-only:');
const compression = require('compression');

const initializePassport = require('./config/passport');
const { checkAuthenticatedUser } = require('./config/authentications');
const {
  secret,
  environement,
  database,
  port,
} = require('./config/index');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

mongoose.connect(
  database,
  {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
).then(() => {
  debug('DataBase Connected');
  debug(`app listening on port ${port}!`);
})
  .catch(err => {
    debug(`update error:  ${err}`);
  });

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.header('Content-Security-Policy', "style-src-elem 'self' https://fonts.googleapis.com/css");
  res.header('Content-Security-Policy', "style-src 'self' https://fonts.googleapis.com/css");
  res.header('Content-Security-Policy', "style-src 'self' https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css");
  res.header('Content-Security-Policy', "style-src 'self' https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css");
  res.header('Content-Security-Policy', "font-src 'self' https://fonts.googleapis.com/css");
  next();
});

// app.use(compression());

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       'default-src': ["'self'"],
//       'font-src': ["'self'", 'https:', 'data:', 'https://fonts.googleapis.com/css'],
//       'style-src': [
//         "'self'",
//         'http://fonts.googleapis.com/css',
//         'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css',
//         'https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css',
//       ],
//     },
//   }),
// );

// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//   }),
// );

// app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  // name: 'sessionId',
  // cookie: {
  //   httpOnly: true,
  //   // secure: environement === 'production',
  // },
}));

const allowedOrigins = ['null', 'http://localhost:3000', 'https://members-only-node.herokuapp.com'];
// app.use(cors({
//   origin(origin, callback) {
//     // allow requests with no origin
//     // (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = 'The CORS policy for this site does not '
//                 + 'allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true,
// }));

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals._csrf = req.csrfToken();
  next();
});

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 0, // disable delaying - user has full speed until the max limit is reached
}));

initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(flash());

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

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', checkAuthenticatedUser, usersRouter);
app.use('/posts', checkAuthenticatedUser, postsRouter);

app.delete('/logout', checkAuthenticatedUser, (req, res) => {
  req.logOut();
  req.flash('info', 'You logged out, see you next time');
  req.session.destroy(() => res.redirect('/'));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// CSRF error handler
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  // handle CSRF token errors here
  res.status(403);
  return res.send('form tampered with');
});

module.exports = app;
