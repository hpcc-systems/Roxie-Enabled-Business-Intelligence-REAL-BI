import axios from 'axios';

export const createDashboard = async (dashboard, workspaceID) => {
  try {
    const response = await axios.post('/api/v1/dashboard', { dashboard, workspaceID });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const deleteExistingDashboard = async dashboardID => {
  try {
    await axios.delete('/api/v1/dashboard', { params: { dashboardID } });
  } catch (error) {
    throw error.response;
  }
};

export const deleteMultipleExistingDashboard = async dashboardIDArray => {
  try {
    await axios.delete('/api/v1/dashboard/multiple', { params: { dashboardIDArray } });
  } catch (error) {
    throw error.response;
  }
};

export const getSharedWithUsers = async dashboardID => {
  try {
    const response = await axios.get('/api/v1/dashboard/shared_with', { params: { dashboardID } });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
