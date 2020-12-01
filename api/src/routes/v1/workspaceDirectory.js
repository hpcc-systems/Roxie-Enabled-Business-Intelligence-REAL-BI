const router = require('express').Router();
const { getWorkspaceDirectory, updateWorkspaceDirectory } = require('../../utils/workspaceDirectory');

router.put('/', async (req, res, next) => {
  const {
    body: { directory, workspaceID },
    user: { id: userID },
  } = req;

  try {
    await updateWorkspaceDirectory(directory, workspaceID, userID);
    const newDirectory = await getWorkspaceDirectory(workspaceID, userID);

    return res.status(200).json(newDirectory);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
