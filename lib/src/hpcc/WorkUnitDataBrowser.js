import Dataset from './Dataset.js';
import { Utils } from './Utils.js';

export class WorkUnitDataBrowser {
  /**
   * constructor description
   * @param  {string} cluster [http://play.hpccsystems.com:8010]
   * @param  {string} user [cluster user name]
   * @param  {string} pass [cluster password]
   */
  constructor(cluster, user, pass) {
    this.cluster = cluster;
    this.user = user;
    this.pass = pass;
  }

  /** @private
   * @param {string} workUnitId
   * @param {string} resultName
   * @return {any}
   * */
  async getData(workUnitId, resultName) {
    let url = this.cluster + `/WsWorkunits/WUResult.json`;
    let headers = new Headers();
    let username = this.user;
    let password = this.pass;
    headers.set('Authorization', 'Basic ' + btoa(username + ':' + password));

    let formData = new FormData();
    formData.append('Wuid', workUnitId);
    formData.append('ResultName', resultName);

    let response = await fetch(url, { method: 'POST', headers, body: formData });
    return response.json();
  }

  /** @public
   * @param {string} workUnitId
   * @param {string} resultName
   * */
  async fetchData(workUnitId, resultName) {
    let response = await this.getData(workUnitId, resultName);
    let data = response['WUResultResponse']['Result'][resultName]['Row'];

    let schema = '<XmlSchema>' + response['WUResultResponse']['Result']['XmlSchema']['xml'] + '</XmlSchema>>';

    let parser = new DOMParser();
    let xmlSchema = parser.parseFromString(schema, 'text/xml');
    let map = Utils.xmlSchema2Map(xmlSchema.getElementsByName('Row')[0]);

    return new Dataset(data, map); //Not a good way to get the types of the columns?
  }
}
