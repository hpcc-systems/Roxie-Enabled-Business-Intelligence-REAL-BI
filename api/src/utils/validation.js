const { body, header, validationResult } = require('express-validator');
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

const validateChangePassword = () => {
  return [
    header('authorization')
      .exists({ checkFalsy: true })
      .withMessage('Invalid Request'),
    body('oldPwd')
      .exists({ checkFalsy: true })
      .escape()
      .withMessage('Field Required'),
    body('newPwd')
      .exists({ checkFalsy: true })
      .escape()
      .withMessage('Field Required'),
    body('newPwd2')
      .exists({ checkFalsy: true })
      .escape()
      .withMessage('Field Required'),
    body('newPwd2').custom((value, { req }) => {
      if (value !== req.body.newPwd) {
        throw new Error('Passwords Do Not Match');
      }

      return true;
    }),
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

const validateSourceCreation = () => {
  return [
    body('source.hpccID')
      .not()
      .isEmpty()
      .withMessage('hpccID not found'),
  ];
};

const validateEclEditorExecution = () => {
  return [
    body('clusterID')
      .isUUID(4)
      .withMessage('Invalid Request'),
    body('targetCluster')
      .not()
      .isEmpty()
      .withMessage('Target Not Selected'),
    body('eclScript')
      .not()
      .isEmpty()
      .withMessage('ECL Script Required'),
  ];
};

const validateWorkspaceShare = () => {
  return [
    body('workspaceID')
      .isUUID(4)
      .withMessage('Invalid Request'),
    body('email')
      .isArray({ min: 1 })
      .withMessage('At least one email address is required'),
    body('email.*')
      .isEmail()
      .withMessage('Valid email required'),
    body('email.*').custom(email => {
      if (!email.includes('lexisnexisrisk') && process.env.INTERNAL_ONLY === 'true') {
        throw new Error('All emails must be internal');
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
  logger.error({ errors: extractedErrors });

  return res.status(400).json({
    message: 'Validation Failed',
    errors: extractedErrors,
  });
};

module.exports = {
  validate,
  validateChangePassword,
  validateEclEditorExecution,
  validateForgotPassword,
  validateLogin,
  validateRegistration,
  validateResetPassword,
  validateSourceCreation,
  validateWorkspaceShare,
};
