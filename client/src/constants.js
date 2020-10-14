export const tokenName = 'realBI';

export const initUserObj = { id: null, workspaces: [], lastWorkspace: null };

export const sourceOptions = ['ecl', 'file', 'query'];

export const directoryObjNameRegexp = new RegExp(/^[a-zA-Z].{1,}$/);

export const chartFillColor = '#333';

export const dataTypes = ['date', 'number', 'string'];

export const messages = ['Choose a dataset', 'Run ECL Script', 'Choose a file'];

export const chartSizes = [
  { label: '25%', value: '3' },
  { label: '33%', value: '4' },
  { label: '50%', value: '6' },
  { label: '66%', value: '8' },
  { label: '75%', value: '9' },
  { label: '100%', value: '12' },
];
