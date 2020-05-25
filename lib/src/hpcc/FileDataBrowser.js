import Dataset from './Dataset.js';
import { Utils } from './Utils.js';

export class FileDataBrowser {
  /**
   * constructor description
   * @param  {string} cluster [http://play.hpccsystems.com:8010]
   * @param  {string} user [cluster user name]
   * @param  {string} pass [cluster password]
   */
  constructor(cluster, user, pass) {
    /** @type {string}*/
    this.cluster = cluster;
    /** @type {string}*/
    this.user = user;
    /** @type {string} */
    this.pass = pass;
  }

  /** @private
   * @param {any} xml
   * @param {Map} columns
   * @return {any}
   * */
  xml2Data(xml, columns) {
    try {
      let data = [];
      if (xml.children.length > 0) {
        for (let i = 0; i < xml.children.length; i++) {
          //dataset node
          let jItem = xml.children.item(i);
          for (let j = 0; j < jItem.children.length; j++) {
            //row
            let kItem = jItem.children.item(j);
            let obj = {};
            for (let k = 0; k < kItem.children.length; k++) {
              //column
              let column = kItem.children.item(k);
              if ('__fileposition__' !== column.nodeName) {
                obj[column.nodeName] = Utils.toDataTypeValue(
                  column.textContent,
                  columns.get(column.nodeName),
                );
              }
            }
            data.push(obj);
          }
        }
      }
      return data;
    } catch (e) {
      console.log(e.message);
    }
  }

  /** @private
   * @param {string} fileName
   * @return {any}
   * */
  async getData(fileName) {
    let url = this.cluster + `/WsDFU/DFUBrowseData?respjson_`;
    let headers = new Headers();
    let username = this.user; //FIXME: After AuthService implementation, use tokens
    let password = this.pass;
    headers.set('Content-Type', 'application/json');
    headers.set('Authorization', 'Basic ' + btoa(username + ':' + password));

    let response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ DFUBrowseDataRequest: { LogicalName: fileName } }),
    });

    return response.json();
  }

  /** @public
   * @param {string} fileName
   * @return {any}
   * */
  async fetchData(fileName) {
    let response = await this.getData(fileName);
    //console.log(response);
    let result = response['DFUBrowseDataResponse']['Result'];

    let s = result.indexOf('<Dataset');
    let e = result.indexOf('</Dataset>');

    let dataset = result.substring(s, e + 10);
    //console.log(dataset);

    s = result.indexOf('<XmlSchema');
    e = result.indexOf('</XmlSchema>');
    let schema = result.substring(s, e + 12);
    //console.log(schema);

    let parser = new DOMParser();

    let xmlSchema = parser.parseFromString(schema, 'text/xml');
    let columns = Utils.xmlSchema2Map(xmlSchema.getElementsByName('Row')[0]);
    //console.log(columns);

    let xmlDoc = parser.parseFromString(dataset, 'text/xml');
    let data = this.xml2Data(xmlDoc, columns);

    return new Dataset(data, columns);
  }
}
