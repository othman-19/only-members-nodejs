const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// Display record new form.
exports.newMember = (req, res, next) => res.render('user/memberShipForm', { title: 'Become a member' });

exports.membershipValidations = [
  check('memberPassword')
    .isLength({ min: 8 })
    .withMessage('Password Must Be at Least 8 Characters')
    .matches('[0-9]')
    .withMessage('Password Must Contain a Number')
    .matches('[A-Z]')
    .withMessage('Password Must Contain an Uppercase Letter')
    .trim()
    .escape(),

  check('memberPasswordConfirmation', 'passwordConfirmation field must have the same value as the password field')
    .exists()
    .custom((value, { req }) => value === req.body.password),
];

exports.createMember = (req, res, next) => {
  const currentUser = req.user;
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  // Create a record object with validated data.
  const data = {
    memberPassword: req.body.memberPassword,
    memberPasswordConfirmation: req.body.memberPasswordConfirmation,
  };

  if (!errors.isEmpty()) {
    // There are errors. Render the form again with sanitized values/error messages.
    res.render('user/membershipForm', {
      title: 'Become a member',
      data,
      errors: errors.array(),
    });
  } else {
    // Data from form is valid.
    // eslint-disable-next-line consistent-return
    bcrypt.hash(req.body.memberPassword, 10, (err, hashed) => {
      if (err) {
        return next(err);
      }
      currentUser.membership.pass = hashed;
      currentUser.currentUser.membership.status = true;
      // data saved. Redirect to record url.
      return res.redirect(currentUser.url);
    });
  }
};
