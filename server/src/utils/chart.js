// DB Models
const { chart: chartModel, source: sourceModel, Sequelize } = require('../models');

//Node mailer for emails
const nodemailer = require('nodemailer');

// Utils
const { awaitHandler, unNestSequelizeObj } = require('./misc');

const { SHARE_EMAIL, SHARE_URL } = process.env;

const getChartsByDashboardID = async dashboardID => {
  let [err, charts] = await awaitHandler(
    chartModel.findAll({
      attributes: { exclude: ['dashboardID'] },
      where: { dashboardID },
      include: [
        {
          model: sourceModel,
          attributes: [
            ['name', 'sourceName'],
            ['type', 'sourceType'],
          ],
        },
      ],
    }),
  );

  // Return error
  if (err) throw err;

  // Create new array of flattened objects
  charts = charts.map(chart => {
    // Get nested objects
    chart = unNestSequelizeObj(chart);
    const { sourceName, sourceType } = unNestSequelizeObj(chart.source); // Equivalent of chart.source.dataValues.sourceName

    // Create new chart object
    const newObj = { ...chart, sourceName, sourceType };

    // Remove original nested object
    delete newObj.source;

    return newObj;
  });

  return charts;
};

const createChart = async (chart, dashboardID, sourceID) => {
  let [err, newChart] = await awaitHandler(chartModel.create({ ...chart, dashboardID, sourceID }));

  // Return error
  if (err) throw err;

  // Get nested object
  newChart = unNestSequelizeObj(newChart);

  return newChart;
};

const shareChart = async (email, dashboardID) => {
  const url = `${SHARE_URL}/dashboard/${dashboardID}`;
  const subject = 'Dashboard Chart Share';
  const text = `Please click on the link to add the chart to your dashboard. ${url}`;

  const transporter = nodemailer.createTransport({
    host: 'appmail.choicepoint.net',
    port: 25,
    secure: false,
    auth: {},
    tls: {
      rejectUnauthorized: false,
    },
  });

  // email options
  let mailOptions = {
    from: SHARE_EMAIL,
    to: email,
    subject: subject,
    text: text,
  };

  // send email
  transporter.sendMail(mailOptions, (error, response) => {
    console.log('Email Trigered');
    if (error) {
      return error.message;
    }
    console.log(response);
  });
  return 'Chart shared successfully';
};

const getChartByID = async chartID => {
  let [err, chart] = await awaitHandler(
    chartModel.findOne({
      where: { id: chartID },
      include: { model: sourceModel },
    }),
  );

  // Return error
  if (err) throw err;

  // Get nested objects
  chart = unNestSequelizeObj(chart);
  let source = unNestSequelizeObj(chart.source);

  return { ...chart, source };
};

const getChartsByDashboardAndSourceID = async (dashboardID, sourceID) => {
  let err, charts;

  if (!dashboardID) {
    [err, charts] = await awaitHandler(chartModel.findAll({ where: { sourceID } }));
  } else {
    [err, charts] = await awaitHandler(chartModel.findAll({ where: { dashboardID, sourceID } }));
  }

  // Return error
  if (err) throw err;

  return charts.length;
};

const updateChartByID = async chart => {
  const { id, ...chartFields } = chart;

  let [err] = await awaitHandler(chartModel.update({ ...chartFields }, { where: { id } }));

  // Return error
  if (err) throw err;

  return;
};

const deleteChartByID = async chartID => {
  let [err] = await awaitHandler(chartModel.destroy({ where: { id: chartID } }));

  // Return error
  if (err) throw err;

  return;
};

const getEclOptionsByWuID = async workunitID => {
  let [err, chart] = await awaitHandler(
    chartModel.findOne({ where: { config: { [Sequelize.Op.substring]: workunitID } } }),
  );

  // Return error
  if (err) throw err;

  // Get nested objects
  chart = unNestSequelizeObj(chart);

  return chart.config.ecl;
};

module.exports = {
  createChart,
  deleteChartByID,
  getChartsByDashboardAndSourceID,
  getChartByID,
  getChartsByDashboardID,
  getEclOptionsByWuID,
  updateChartByID,
  shareChart,
};
