const router = require('express').Router();
const { getWorkspaceDirectory, updateWorkspaceDirectory } = require('../../utils/workspaceDirectory');

router.put('/', async (req, res, next) => {
  const {
    body: { directory, workspaceID },
  } = req;

  try {
    await updateWorkspaceDirectory(directory, workspaceID);
    const newDirectory = await getWorkspaceDirectory(workspaceID);

    return res.status(200).json(newDirectory);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
