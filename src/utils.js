const mysql = require('mysql');

function safeInvoke(callback, args) {
  if (typeof callback === 'function') {
    setImmediate(() => {
      callback(args);
    });
  }
}

function prepareQuery(query, parameters) {
  let sql = query;
  if (parameters !== null && typeof parameters === 'object') {
    sql = query.replace(/@(\w+)/g, (txt, key) => {
      let result = txt;
      if (Object.prototype.hasOwnProperty.call(parameters, key)) {
        result = mysql.escape(parameters[key]);
      } else if (Object.prototype.hasOwnProperty.call(parameters, `@${key}`)) {
        result = mysql.escape(parameters[`@${key}`]);
      }
      return result;
    });
  }
  return sql;
}

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

module.exports = { safeInvoke, prepareQuery, typeCast };
