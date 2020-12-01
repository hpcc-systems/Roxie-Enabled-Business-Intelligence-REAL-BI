import axios from 'axios';

export const createSource = async source => {
  try {
    const response = await axios.post('/api/v1/source/', { source });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createSourceObj = (localState, eclRef) => {
  const {
    selectedSource: { target, hpccID, name },
    sourceType,
  } = localState;
  const { cluster, workunitID } = eclRef;

  if (sourceType === 'ecl') {
    return { hpccID: workunitID, name: workunitID, target: cluster, type: sourceType };
  }

  return { hpccID, name, target, type: sourceType };
};
