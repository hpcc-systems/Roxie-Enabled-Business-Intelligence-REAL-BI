/* eslint-disable no-throw-literal */
import axios from 'axios';

export const shareWorkspace = async (workspaceID, email, directory, dashboards) => {
  try {
    // TODO:temp settings
    const response = await axios.post('/api/v1/share', { workspaceID, email, directory, dashboards });
    return response.data;
    // TODO:uncomment later
    //    await axios.post('/api/v1/share', { workspaceID, email, directory, dashboards });
  } catch (err) {
    if (err?.response?.data?.errors) {
      throw err.response.data.errors;
    }

    throw err.response.data;
  }
};
/* eslint-enable no-throw-literal */
