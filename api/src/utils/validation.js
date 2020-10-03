const { body, validationResult } = require('express-validator');
const logger = require('../config/logger');

const validateLogin = () => {
  return [
    body('username')
      .exists({ checkFalsy: true })
      .trim()
      .escape()
      .withMessage('Field Required'),
    body('password')
      .exists({ checkFalsy: true })
      .escape()
      .withMessage('Field Required'),
  ];
};

const validateRegistration = () => {
  return [
    body('firstName')
      .exists({ checkFalsy: true })
      .trim()
      .escape()
      .withMessage('Field Required'),
    body('lastName')
      .exists({ checkFalsy: true })
      .trim()
      .escape()
      .withMessage('Field Required'),
    body('username')
      .exists({ checkFalsy: true })
      .trim()
      .escape()
      .withMessage('Field Required'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid Email'),
    body('password')
      .exists({ checkFalsy: true })
      .escape()
      .withMessage('Field Required'),
    body('confirmPassword')
      .exists({ checkFalsy: true })
      .escape()
      .withMessage('Field Required'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords Do Not Match');
      }

      return true;
    }),
  ];
};

const validateForgotPassword = () => {
  return [
    body('username')
      .exists({ checkFalsy: true })
      .trim()
      .escape()
      .withMessage('Field Required'),
  ];
};

const validateResetPassword = () => {
  return [
    body('id')
      .isUUID(4)
      .withMessage('Invalid Request'),
    body('password')
      .exists({ checkFalsy: true })
      .escape()
      .withMessage('Field Required'),
    body('confirmPassword')
      .exists({ checkFalsy: true })
      .escape()
      .withMessage('Field Required'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords Do Not Match');
      }

      return true;
    }),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);

  // No errors received
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().forEach(({ msg, param }) => extractedErrors.push({ [param]: msg }));

  // Record errors in log file
  logger.error(JSON.stringify({ errors: extractedErrors }));

  return res.status(400).json({ errors: extractedErrors });
};

module.exports = {
  validate,
  validateForgotPassword,
  validateLogin,
  validateRegistration,
  validateResetPassword,
};
