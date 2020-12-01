import axios from 'axios';

export const shareWorkspace = async (workspaceID, email, dashboards) => {
  try {
    await axios.post('/api/workspace/share', { workspaceID, email, dashboards });
  } catch (err) {
    const { data } = err.response;

    // Not an express validation error object
    if (!data) {
      throw [{ msg: err.response }];
    }

    throw data.errors;
  }

  return;
};
