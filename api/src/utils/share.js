// const transporter = require('../config/nodemailer');

const shareWorkspace = async (workspaceID, recipientEmail) => {
  const url = `${process.env.SHARE_URL}/workspace/${workspaceID}`;
  const subject = 'Real BI - Shared Workspace';
  const text = `A user has shared a workspace with you. Please click on the link to view the workspace. ${url}`;

  console.log(workspaceID, recipientEmail, subject, text);

  return;
};

module.exports = { shareWorkspace };
