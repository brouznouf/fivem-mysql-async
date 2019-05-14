function typeCast(field, next) {
  let dateString = '';
  switch (field.type) {
    case 'DATETIME':
    case 'DATETIME2':
    case 'TIMESTAMP':
    case 'TIMESTAMP2':
    case 'NEWDATE':
    case 'DATE':
      dateString = field.string();
      if (field.type === 'DATE') dateString += ' 00:00:00';
      return (new Date(dateString)).getTime();
    case 'TINY':
      if (field.length === 1) {
        return (field.string() !== '0');
      }
      return next();
    case 'BIT':
      return Number(field.buffer()[0]);
    default:
      return next();
  }
}

function prepareLegacyQuery(query, parameters) {
  let sql = query;
  let params = parameters;
  if (params !== null && typeof params === 'object' && !Array.isArray(params)) {
    params = [];
    sql = sql.replace(/@(\w+)/g, (txt) => {
      if (Object.prototype.hasOwnProperty.call(parameters, txt)) {
        params.push(parameters[txt]);
        return '?';
      }
      return txt;
    });
  }
  return [sql, params];
}

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

function safeInvoke(callback, args) {
  if (typeof callback === 'function') {
    setImmediate(() => {
      callback(args);
    });
  }
}

module.exports = {
  typeCast, prepareLegacyQuery, safeInvoke, sanitizeInput,
};
