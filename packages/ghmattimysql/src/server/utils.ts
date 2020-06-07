import { BINARY } from 'mysql/lib/protocol/constants/charsets.js';
import QueryParameters from './mysql/queryParameters';
import { TransactionQuery, TransactionQueries } from './mysql/transactionQueries';

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
    case 'TINY_BLOB':
    case 'MEDIUM_BLOB':
    case 'LONG_BLOB':
    case 'BLOB':
      if (field.packet.charsetNr === BINARY) {
        return [...field.buffer()];
      } 
      return field.string();
    default:
      return next();
  }
}

function mysqlConvertLegacyFormat(query: string, parameters: QueryParameters) {
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

function prepareLegacyQuery(query: string, parameters?: any) {
  let sql = query;
  let params = parameters;
  if (params !== null && typeof params === 'object' && !Array.isArray(params)) {
    ({ sql, params } = mysqlConvertLegacyFormat(sql, params));
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

function safeInvoke(callback, args: any) {
  if (typeof callback === 'function') {
    setImmediate(() => {
      callback(args);
    });
  }
}

function prepareTransactionLegacyQuery(querys): TransactionQueries {
  const sqls = querys;
  sqls.forEach((element, index: number) => {
    const [query, values] = prepareLegacyQuery(element.query, element.values);
    sqls[index] = {
      query,
      values: (Array.isArray(values)) ? values : [],
    };
  });
  return sqls;
}

function sanitizeTransactionInput(querys, params, callback): [TransactionQueries, any] {
  let sqls: TransactionQueries = [];
  let cb = callback;
  // start by type-checking and sorting the data
  // impl: better checks
  if (!querys.every((query: string | TransactionQuery) => typeof query === 'string')) sqls = querys;
  else {
    const values = (typeof params === 'function') ? [] : params;
    querys.forEach((element: string) => {
      sqls.push({ query: element, values });
    });
  }
  if (typeof params === 'function') cb = params;
  sqls = prepareTransactionLegacyQuery(sqls);
  return [sqls, cb];
}

export {
  typeCast,
  safeInvoke,
  sanitizeInput,
  sanitizeTransactionInput,
};
