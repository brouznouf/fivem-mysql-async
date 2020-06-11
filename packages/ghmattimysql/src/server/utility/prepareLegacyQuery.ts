import convertLegacyQuery from './convertLegacyQuery';

function prepareLegacyQuery(query: string, parameters?: any) {
  let sql = query;
  let params = parameters;
  if (params !== null && typeof params === 'object' && !Array.isArray(params)) {
    ({ sql, params } = convertLegacyQuery(sql, params));
  }
  return [sql, params];
}

export default prepareLegacyQuery;
