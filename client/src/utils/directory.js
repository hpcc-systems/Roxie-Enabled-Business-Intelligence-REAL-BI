// Utils
import { sortArr } from './misc';

const getDashboardsFromDirectory = (directory, dashboards) => {
  directory.forEach(obj => {
    const { children = false } = obj;

    // Has a nested children []
    // Recurse through the children []
    if (children) {
      return getDashboardsFromDirectory(children, dashboards);
    }

    // Push the object onto the dashboards []
    return dashboards.push(obj);
  });

  // Sort by Name
  dashboards = dashboards.sort((a, b) => sortArr(a, b, 'name'));

  return dashboards;
};

const getFavoriteDashboards = dashboards => {
  // Filter to dashboard objects where favorite is true
  dashboards = dashboards.filter(({ favorite }) => favorite === true);

  // Sort by Name
  dashboards = dashboards.sort((a, b) => sortArr(a, b, 'name'));

  return dashboards;
};

const updateDashboardObj = (directory, searchID, key, value) => {
  // Get new reference to directory []
  const newDirectory = directory;

  // Convert to a number, if possible
  searchID = isNaN(searchID) ? searchID : Number(searchID);

  // Loop through the array for each index
  // Used over a forEach() to allow for break;
  for (const obj of newDirectory) {
    const { children = false, id: objID } = obj;
    const foundID = objID === searchID;

    // Found the right ID and it is not a folder object
    if (foundID && !children) {
      // The object has the key being searched for
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        // Update key value
        obj[key] = value;
      }

      // Exit loop
      break;
    }

    // Didn't find object matching the searchID and it has a nested children []
    // Recurse through the children []
    if (children) {
      updateDashboardObj(children, searchID, key, value);
    }
  }

  // Return the new updated directory
  return newDirectory;
};

const addObjectToDirectory = (directory, searchID, newObj) => {
  // Get new reference to directory []
  const newDirectory = directory;

  if (searchID === 'root') {
    // Push new object into the directory []
    newDirectory.push(newObj);

    // Return the new updated directory
    return newDirectory;
  }

  // Convert to a number, if possible
  searchID = isNaN(searchID) ? searchID : Number(searchID);

  // Loop through the array for each index
  // Used over a forEach() to allow for break;
  for (const obj of directory) {
    const { children = false, id: objID } = obj;
    const foundID = objID === searchID;

    // Found the right ID and it has a children []
    if (foundID && children) {
      // Add the object to the array and exit the loop
      children.push(newObj);
      break;
    }

    // Didn't find object matching the searchID and it has a nested children []
    // Recurse through the children []
    if (children) {
      addObjectToDirectory(children, searchID, newObj);
    }
  }

  // Return the new updated directory
  return newDirectory;
};

export { addObjectToDirectory, getDashboardsFromDirectory, getFavoriteDashboards, updateDashboardObj };
