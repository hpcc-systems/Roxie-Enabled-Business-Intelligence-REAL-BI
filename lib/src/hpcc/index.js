import { FileDataBrowser } from './FileDataBrowser.js';
import { WorkUnitDataBrowser } from './WorkUnitDataBrowser.js';

/**
 * @param {Map} input
 * */
function mapToString(input) {
  let formattedString = '';
  input.forEach(function(value, key) {
    formattedString += `${key}: ${value},`;
  });

  return formattedString;
}

async function init() {
  const fileDataBrowser = new FileDataBrowser('http://play.hpccsystems.com:8010', '', '');
  let fileData = await fileDataBrowser.fetchData('~achala::samples:cases.flat');
  document.getElementById('file_data').innerHTML =
    '<div>Dataset: ' +
    JSON.stringify(fileData.data) +
    '</div>' +
    '<div>Columns:  ' +
    mapToString(fileData.columns) +
    '</div>';

  const workunitDataBrowser = new WorkUnitDataBrowser('http://play.hpccsystems.com:8010', '', '');
  let wuData = await workunitDataBrowser.fetchData('W20200525-163147', 'cases');
  document.getElementById('workunit_data').innerHTML =
    '<div>Dataset: ' +
    JSON.stringify(wuData.data) +
    '</div>' +
    '<div>Columns:  ' +
    mapToString(wuData.columns) +
    '</div>';
}

init().then(() => {});
