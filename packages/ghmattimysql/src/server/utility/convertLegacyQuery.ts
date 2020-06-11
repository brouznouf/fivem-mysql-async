import QueryParameters from '../mysql/queryParameters';

function convertLegacyQuery(query: string, parameters: QueryParameters) {
  let sql = query;
  const params = [];
  sql = sql.replace(/@(\w+)/g, (txt, match) => {
    let returnValue = txt;
    if (Object.prototype.hasOwnProperty.call(parameters, txt)) {
      params.push(parameters[txt]);
      returnValue = '?';
    } else if (Object.prototype.hasOwnProperty.call(parameters, match)) {
      params.push(parameters[match]);
      returnValue = '?';
    }
    return returnValue;
  });
  return { sql, params };
}

export default convertLegacyQuery;
