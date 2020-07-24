// Utils
import { sortArr } from './misc';

export const getDashboardsFromDirectory = (directory, dashboards) => {
  if (!directory) {
    return [];
  }

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
  dashboards = sortArr(dashboards, 'name');

  return dashboards;
};

export const getFavoriteDashboards = dashboards => {
  // Filter to dashboard objects where favorite is true
  dashboards = dashboards.filter(({ favorite }) => favorite === true);

  // Sort by Name
  dashboards = sortArr(dashboards, 'name');

  return dashboards;
};

export const getObjectNames = (directory, names) => {
  // Iterate through objects in array
  for (const obj of directory) {
    const { children = false, name } = obj;

    // Add name to array
    names.push(name.toLowerCase().trim());

    // Obj has children array, recurse through the nested array
    if (children) {
      getObjectNames(children, names);
    }
  }

  // Return the new updated directory
  return names;
};

export const updateDashboardObj = (directory, searchID, key, value) => {
  // Get new reference to directory []
  const newDirectory = directory;

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

export const updateObjectInDirectory = (directory, searchID, directoryObj) => {
  // Set new array variable
  const newDirectory = new Array(...directory);

  // Iterate through objects in array
  for (const [index, obj] of newDirectory.entries()) {
    const { children = false, id: objID } = obj;
    const foundID = objID === searchID;

    // Found desired entry
    if (foundID) {
      // Update object from array and exit loop
      newDirectory[index] = directoryObj;
      break;
    }

    // Obj has children array, recurse through the nested array
    if (children) {
      obj.children = updateObjectInDirectory(children, searchID, directoryObj);
    }
  }

  // Return the new updated directory
  return newDirectory;
};

export const addObjectToDirectory = (directory, searchID, newObj) => {
  // Get new reference to directory []
  const newDirectory = directory;

  if (searchID === 'root') {
    // Push new object into the directory []
    newDirectory.push(newObj);

    // Return the new updated directory
    return newDirectory;
  }

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

export const removeObjFromDirectory = (directory, searchID) => {
  // Set new array variable
  const newDirectory = new Array(...directory);

  // Iterate through objs in array
  for (const [index, obj] of newDirectory.entries()) {
    const { children = false, id: objID } = obj;
    const foundID = objID === searchID;

    // Found desired entry
    if (foundID) {
      // Remove object from array and exit loop
      newDirectory.splice(index, 1);
      break;
    }

    // Obj has children array, recurse through the nested array
    if (children) {
      obj.children = removeObjFromDirectory(children, searchID);
    }
  }

  // Return the new updated directory
  return newDirectory;
};
