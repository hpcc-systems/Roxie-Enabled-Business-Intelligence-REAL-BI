const initUserObj = { id: null, directory: [], lastDashboard: null };

// Convert a number to a string with a thousands place separator
const thousandsSeparator = num => `${num}`.replace(/\d{1,3}(?=(\d{3})+$)/g, s => `${s},`);

export { initUserObj, thousandsSeparator };
