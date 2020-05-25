export class Utils {
  /**
   * @static
   * @param {string} inValue
   * @param {string} dataType
   * @return {any}
   * */
  static toDataTypeValue(inValue, dataType) {
    //console.log(dataType);
    if ('string' !== dataType) {
      return parseFloat(inValue);
    } else {
      return inValue;
    }
  }

  /** @static
   * @param {any} xml
   * @return {Map}
   * */
  static xmlSchema2Map(xml) {
    try {
      let rows = new Map();

      if (xml.children.length > 0) {
        for (let i = 0; i < xml.children.length; i++) {
          //dataset node
          let jItem = xml.children.item(i);
          for (let j = 0; j < jItem.children.length; j++) {
            //row
            let kItem = jItem.children.item(j);
            for (let k = 0; k < kItem.children.length; k++) {
              //column
              let column = kItem.children.item(k);
              let name = column.getAttribute('name');
              let xmlType = column.getAttribute('type');
              rows.set(name, xmlType.substring(3, xmlType.length));
            }
          }
        }
      }
      return rows;
    } catch (e) {
      console.log(e.message);
    }
  }
}
