// DB Models
const { chart: chartModel, query: queryModel } = require('../models');

//Node mailer for emails
var nodemailer = require('nodemailer');

// Utils
const { awaitHandler, unNestSequelizeObj } = require('./misc');

const getChartsByDashboardID = async dashboardID => {
  let [err, charts] = await awaitHandler(
    chartModel.findAll({
      attributes: { exclude: ['dashboardID'] },
      where: { dashboardID },
      include: [
        {
          model: queryModel,
          attributes: [['name', 'queryName']],
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
    let { queryName } = unNestSequelizeObj(chart.query); // Equivalent of chart.query.dataValues.queryName

    // Create new chart object
    const newObj = { ...chart, queryName };

    // Remove original nested object
    delete newObj.query;

    return newObj;
  });

  return charts;
};

const createChart = async (chart, dashboardID, queryID) => {
  let [err, newChart] = await awaitHandler(chartModel.create({ ...chart, dashboardID, queryID }));

  // Return error
  if (err) throw err;

  // Get nested object
  newChart = unNestSequelizeObj(newChart);

  return newChart;
};

const shareChart = async (email, dashboardID, url) => {
  let fromMail = 'realbi@lexisnexis.com'; //Lohith.JR@lexisnexisrisk.com
  let toMail = email;
  let subject = 'Dashboard Chart Share';
  let text = 'Please click on the link to add the chart to your dashboard. ' + url;

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
    from: fromMail,
    to: toMail,
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
      include: { model: queryModel },
    }),
  );

  // Return error
  if (err) throw err;

  // Get nested objects
  chart = unNestSequelizeObj(chart);
  let query = unNestSequelizeObj(chart.query);

  return { ...chart, query };
};

const getChartsByDashboardAndQueryID = async (dashboardID, queryID) => {
  let err, charts;

  if (!dashboardID) {
    [err, charts] = await awaitHandler(chartModel.findAll({ where: { queryID } }));
  } else {
    [err, charts] = await awaitHandler(chartModel.findAll({ where: { dashboardID, queryID } }));
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

module.exports = {
  createChart,
  deleteChartByID,
  getChartsByDashboardAndQueryID,
  getChartByID,
  getChartsByDashboardID,
  updateChartByID,
  shareChart,
};
