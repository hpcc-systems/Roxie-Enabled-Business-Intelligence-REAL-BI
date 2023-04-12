const router = require('express').Router();
const { getDashboardByID } = require('../../utils/dashboard');
const {
  createRelation,
  deleteRelation,
  getDashboardRelationsByDashboardID,
  updateRelation,
} = require('../../utils/dashboardRelation');

router.post('/', async (req, res, next) => {
  const {
    body: { dashboardID, relationsArr = [] },
    user: { id: userID },
  } = req;

  try {
    const { permission = 'Read-Only' } = await getDashboardByID(dashboardID, userID);

    if (permission !== 'Owner') {
      const error = new Error('Permission Denied');
      throw error;
    }

    const promises = relationsArr.map(relationObj => createRelation(relationObj, dashboardID));
    await Promise.all(promises);

    return res.status(201).end();
  } catch (error) {
    next(error);
  }
});

router.put('/', async (req, res, next) => {
  const {
    body: { dashboardID, relationsArr = [] },
    user: { id: userID },
  } = req;

  try {
    const { permission = 'Read-Only' } = await getDashboardByID(dashboardID, userID);

    if (permission !== 'Owner') {
      const error = new Error('Permission Denied');
      throw error;
    }

    const promises = relationsArr.map(relationObj => updateRelation(relationObj));
    await Promise.all(promises);

    return res.status(200).end();
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  const {
    query: { dashboardID, relationsArr = [] },
    user: { id: userID },
  } = req;

  try {
    const { permission = 'Read-Only' } = await getDashboardByID(dashboardID, userID);

    if (permission !== 'Owner') {
      const error = new Error('Permission Denied');
      throw error;
    }

    const promises = relationsArr.map(relationObj => deleteRelation(JSON.parse(relationObj).id));
    await Promise.all(promises);

    const relations = await getDashboardRelationsByDashboardID(dashboardID);

    return res.status(200).json(relations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
