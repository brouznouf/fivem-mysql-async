import prepareLegacyQuery from './prepareLegacyQuery';

function sanitizeInput(query, parameters, callback) {
  let sql = query;
  let params = parameters;
  let cb = callback;

  if (typeof parameters === 'function') {
    cb = parameters;
  }
  [sql, params] = prepareLegacyQuery(query, params);
  if (!Array.isArray(params)) {
    params = [];
  }
  return [sql, params, cb];
}

export default sanitizeInput;
