const router = require('express').Router();
const { getWorkspaceByID, sendShareWorkspaceEmail } = require('../../utils/workspace');
const { getUserByEmail } = require('../../utils/user');
const { createShare, addSharedResourcesToUser } = require('../../utils/share');
const { validate, validateWorkspaceShare } = require('../../utils/validation');

router.post('/', [validateWorkspaceShare(), validate], async (req, res, next) => {
  const {
    body: { workspaceID, directory, email: emailArr, dashboards },
    user: { id: userID },
  } = req;

  const { TRANSPORT_HOST, TRANSPORT_PORT, SHARE_URL } = process.env;

  try {
    const { permission = 'Read-Only' } = await getWorkspaceByID(workspaceID, userID);

    if (permission !== 'Owner') {
      const error = new Error('Permission Denied');
      throw error;
    }

    if (!TRANSPORT_HOST || !TRANSPORT_PORT) {
      throw new Error('Email service is not set up.');
    }

    for await (const email of emailArr) {
      let user = await getUserByEmail(email);
      let newUser = true;

      // Create unique share record with necessary info
      const { id: shareID } = await createShare({ email, workspaceID, directory, dashboards, userID });

      if (user) {
        // If there is a user already in the system, go ahead and add the permissions.
        newUser = false;
        await addSharedResourcesToUser(email, user.username, shareID);
      }

      await sendShareWorkspaceEmail(shareID, workspaceID, email, newUser);
    }
    // TODO: temp setting
    const url = `${SHARE_URL}/workspace/${workspaceID}`;
    res.send(url);
    // TODO:uncomment later
    // res.status(200).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
