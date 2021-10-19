const { body, header, query, validationResult } = require('express-validator');
const logger = require('../config/logger');

const validateLogin = () => {
  return [
    body('username').exists({ checkFalsy: true }).trim().escape().withMessage('Field Required'),
    body('password').exists({ checkFalsy: true }).escape().withMessage('Field Required'),
  ];
};

const validateRegistration = () => {
  return [
    body('firstName').exists({ checkFalsy: true }).trim().escape().withMessage('Field Required'),
    body('lastName').exists({ checkFalsy: true }).trim().escape().withMessage('Field Required'),
    body('username').exists({ checkFalsy: true }).trim().escape().withMessage('Field Required'),
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').exists({ checkFalsy: true }).escape().withMessage('Field Required'),
    body('confirmPassword').exists({ checkFalsy: true }).escape().withMessage('Field Required'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords Do Not Match');
      }

      return true;
    }),
  ];
};

const validateForgotPassword = () => {
  return [body('username').exists({ checkFalsy: true }).trim().escape().withMessage('Field Required')];
};

const validateChangePassword = () => {
  return [
    header('authorization').exists({ checkFalsy: true }).withMessage('Invalid Request'),
    body('oldPwd').exists({ checkFalsy: true }).escape().withMessage('Field Required'),
    body('newPwd').exists({ checkFalsy: true }).escape().withMessage('Field Required'),
    body('newPwd2').exists({ checkFalsy: true }).escape().withMessage('Field Required'),
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
    body('id').isUUID(4).withMessage('Invalid Request'),
    body('password').exists({ checkFalsy: true }).escape().withMessage('Field Required'),
    body('confirmPassword').exists({ checkFalsy: true }).escape().withMessage('Field Required'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords Do Not Match');
      }

      return true;
    }),
  ];
};

const validateSourceCreation = () => {
  return [body('source.hpccID').not().isEmpty().withMessage('hpccID not found')];
};

const validateEclEditorExecution = () => {
  return [
    body('clusterID').isUUID(4).withMessage('Invalid Request'),
    body('targetCluster').not().isEmpty().withMessage('Target Not Selected'),
    body('eclScript').not().isEmpty().withMessage('ECL Script Required'),
  ];
};

const validateWorkspaceShare = () => {
  const { INTERNAL_DOMAINS_ONLY, INTERNAL_DOMAIN } = process.env;
  return [
    body('workspaceID').isUUID(4).withMessage('Invalid Request'),
    body('email').isArray({ min: 1 }).withMessage('At least one email address is required'),
    body('email.*').isEmail().withMessage('Valid email required'),
    body('email.*').custom(email => {
      if (!email.includes(INTERNAL_DOMAIN) && INTERNAL_DOMAINS_ONLY === 'true') {
        throw new Error('All emails must be internal');
      }

      return true;
    }),
  ];
};

const validateChart = () => {
  return [
    body('dashboardID').optional({ checkFalsy: true }).isUUID(4).withMessage('Invalid dashboardID'),
    body('sourceID').optional({ checkFalsy: true }).isUUID(4).withMessage('Invalid sourceID'),
    body('chart.configuration.axis1.type').trim().blacklist('<>&\'"/'),
    body('chart.configuration.axis1.label').trim().blacklist('<>&\'"/'),
    body('chart.configuration.axis1.value').trim().blacklist('<>&\'"/'),
    body('chart.configuration.axis1.showTickLabels')
      .optional({ checkFalsy: true })
      .isBoolean()
      .withMessage('Invalid color for "show labels 1" settings'),
    body('chart.configuration.axis2.type').trim().blacklist('<>&\'"/'),
    body('chart.configuration.axis2.label').trim().blacklist('<>&\'"/'),
    body('chart.configuration.axis2.value').trim().blacklist('<>&\'"/'),
    body('chart.configuration.axis2.showTickLabels')
      .optional({ checkFalsy: true })
      .isBoolean()
      .withMessage('Invalid color for "show labels 2" settings'),
    body('chart.configuration.axis3.type').trim().blacklist('<>&\'"/'),
    body('chart.configuration.axis3.label').trim().blacklist('<>&\'"/'),
    body('chart.configuration.axis3.value').trim().blacklist('<>&\'"/'),
    body('chart.configuration.axis3.showTickLabels')
      .optional({ checkFalsy: true })
      .isBoolean()
      .withMessage('Invalid color for "show labels 3" settings'),
    body('chart.configuration.fields.*.name').trim().blacklist('<>&\'"/'),
    body('chart.configuration.fields.*.color').isHexColor().withMessage('Invalid color in "fields" settings'),
    body('chart.configuration.fields.*.label').trim().blacklist('<>&\'"/'),
    body('chart.configuration.fields.*.linkBase')
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage('Invalid link provided'),
    body('chart.configuration.fields.*.asLink')
      .optional({ checkFalsy: true })
      .isBoolean()
      .withMessage('Invalid value for "as link'),
    body('chart.configuration.params.*.*').trim().blacklist('<>&\'"/'),
    body('chart.configuration.sortBy.*').trim().blacklist('<>&\'"/'),
    body('chart.configuration.groupBy.*').trim().blacklist('<>&\'"/'),
    body('chart.configuration.dataset').trim().blacklist('<>'),
    body('chart.configuration.stacked')
      .optional({ checkFalsy: true })
      .isBoolean()
      .withMessage('Invalid value for "stacked'),
    body('chart.configuration.isStatic')
      .optional({ checkFalsy: true })
      .isBoolean()
      .withMessage('Invalid value for "static"'),
    body('chart.configuration.drillDown.hasDrillDown')
      .optional({ checkFalsy: true })
      .isBoolean()
      .withMessage('Invalid value for "drill down"'),
    body('chart.configuration.drillDown.drilledByField').trim().blacklist('<>&\'"/'),
    body('chart.configuration.drillDown.drilledOptions.*').trim().blacklist('<>&\'"/'),
    body('chart.configuration.horizontal')
      .optional({ checkFalsy: true })
      .isBoolean()
      .withMessage('Invalid value for "horizontal"'),
    body('chart.configuration.mapMarkers.*.id')
      .optional({ checkFalsy: true })
      .isUUID(4)
      .withMessage('Invalid map marker ID'),
    body('chart.configuration.mapMarkers.*.latitude').trim().blacklist('<>&\'"/'),
    body('chart.configuration.mapMarkers.*.longitude').trim().blacklist('<>&\'"/'),
    body('chart.configuration.mapMarkers.*.markerIcon').trim().blacklist('<>&\'"/'),
    body('chart.configuration.mapMarkers.*.markerColor')
      .optional({ checkFalsy: true })
      .isHexColor()
      .withMessage('Invalid "map marker color" settings'),
    body('chart.configuration.mapMarkers.*.popUpInfo.*.id')
      .optional({ checkFalsy: true })
      .isUUID(4)
      .withMessage('Invalid pop Up id'),
    body('chart.configuration.mapMarkers.*.popUpInfo.*.label').trim().blacklist('<>&\'"/'),
    body('chart.configuration.mapMarkers.*.popUpInfo.*.datafieldName').trim().blacklist('<>&\'"/'),
    body('chart.configuration.conditionals.*.field').trim().blacklist('<>&\'"/'),
    body('chart.configuration.conditionals.*.rules.*.color')
      .optional({ checkFalsy: true })
      .isHexColor()
      .withMessage('Invalid color in "conditionals" settings'),
    body('chart.configuration.conditionals.*.rules.*.value').trim().blacklist('<>&\'"/'),
    body('chart.configuration.conditionals.*.rules.*.operand').whitelist('<>='),
    body('chart.configuration.showLastExecuted')
      .optional({ checkFalsy: true })
      .isBoolean()
      .withMessage('Invalid Show Last Executed value'),
    body('chart.configuration.textBoxAlignText').trim().blacklist('<>&\'"/'),
    body('chart.configuration.chartDescription').trim().blacklist('<>&\'"/'),
    body('chart.configuration.title').trim().blacklist('<>&\'"/'),
    body('chart.configuration.type').trim().blacklist('<>&\'"/'),
    body('chart.configuration.sort').trim().blacklist('<>&\'"/'),
    body('chart.id').optional({ checkFalsy: true }).isUUID(4).withMessage('Invalid dashboard id'),
    body('chart.source.id').optional({ checkFalsy: true }).isUUID(4).withMessage('Invalid source id'),
    body('chart.source.hpccID').optional({ checkFalsy: true }).trim().blacklist('<>&\'"/'),
    body('chart.source.name').optional({ checkFalsy: true }).trim().blacklist('<>&\'"/'),
    body('chart.source.target').optional({ checkFalsy: true }).trim().blacklist('<>&\'"/'),
    body('chart.source.type').optional({ checkFalsy: true }).trim().blacklist('<>&\'"/'),
  ];
};

const validateDeleteChart = () => {
  return [
    query('chartID').isUUID(4).withMessage('Invalid chartID'),
    query('dashboardID').isUUID(4).withMessage('Invalid dashboardID'),
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
  validateChart,
  validateDeleteChart,
  validateChangePassword,
  validateEclEditorExecution,
  validateForgotPassword,
  validateLogin,
  validateRegistration,
  validateResetPassword,
  validateSourceCreation,
  validateWorkspaceShare,
};
