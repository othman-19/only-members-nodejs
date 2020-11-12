const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// Display record new form.
exports.newMember = (req, res, next) => res.render('user/RoleForm', { title: 'Become a member' });

exports.roleValidations = [
  check('rolePassword')
    .isLength({ min: 8 })
    .withMessage('Password Must Be at Least 8 Characters')
    .matches('[0-9]')
    .withMessage('Password Must Contain a Number')
    .matches('[A-Z]')
    .withMessage('Password Must Contain an Uppercase Letter')
    .trim()
    .escape(),

  check('rolePasswordConfirmation', 'passwordConfirmation field must have the same value as the password field')
    .exists()
    .custom((value, { req }) => value === req.body.password),
];

exports.createMember = (req, res, next) => {
  const currentUser = req.user;
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  // Create a record object with validated data.
  const data = {
    rolePassword: req.body.rolePassword,
    rolePasswordConfirmation: req.body.rolePasswordConfirmation,
  };

  if (!errors.isEmpty()) {
    // There are errors. Render the form again with sanitized values/error messages.
    res.render('user/roleForm', {
      title: 'Become a member',
      data,
      errors: errors.array(),
    });
  } else {
    // Data from form is valid.
    // eslint-disable-next-line consistent-return
    bcrypt.hash(req.body.rolePassword, 10, (err, hashed) => {
      if (err) {
        return next(err);
      }
      currentUser.role.memberPass = hashed;
      currentUser.role = 'member';
      // data saved. Redirect to record url.
      return res.redirect(currentUser.url);
    });
  }
};

exports.createAdmin = (req, res, next) => {
  const currentUser = req.user;
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  // Create a record object with validated data.
  const data = {
    rolePassword: req.body.rolePassword,
    rolePasswordConfirmation: req.body.rolePasswordConfirmation,
  };

  if (!errors.isEmpty()) {
    // There are errors. Render the form again with sanitized values/error messages.
    res.render('user/roleForm', {
      title: 'Become an admin',
      data,
      errors: errors.array(),
    });
  } else {
    // Data from form is valid.
    // eslint-disable-next-line consistent-return
    bcrypt.hash(req.body.rolePassword, 10, (err, hashed) => {
      if (err) {
        return next(err);
      }
      currentUser.role.adminPass = hashed;
      currentUser.role = 'admin';
      // data saved. Redirect to record url.
      return res.redirect(currentUser.url);
    });
  }
};
