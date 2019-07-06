const { parseUrl } = require('mysql/lib/ConnectionConfig');
const Profiler = require('../server/profiler.js');
const Logger = require('../server/logger.js');
const MySQL = require('../server/mysql.js');
const {
  typeCast, safeInvoke, sanitizeInput, sanitizeTransactionInput,
} = require('../server/utils.js');

const logger = new Logger(global.GetConvar('mysql_debug_output', 'console'));
const profiler = new Profiler(logger, {
  trace: global.GetConvarInt('mysql_debug', 0),
  slowQueryWarningTime: global.GetConvarInt('mysql_slow_query_warning', 100),
});

const config = JSON.parse(global.LoadResourceFile('ghmattimysql', 'config.json'));
const configFromString = parseUrl(global.GetConvar('mysql_connection_string', 'mysql://localhost/fivem'));

const mysql = new MySQL(config || configFromString, logger, profiler);

const currentResourceName = global.GetCurrentResourceName();

global.exports('scalar', (query, parameters, callback, resource) => {
  const invokingResource = resource || global.GetInvokingResource();
  let sql = query;
  let values = parameters;
  let cb = callback;
  [sql, values, cb] = sanitizeInput(sql, values, cb);

  mysql.execute({ sql, values, typeCast }, invokingResource).then((result) => {
    safeInvoke(cb, (result && result[0]) ? Object.values(result[0])[0] : null);
    return true;
  }).catch(() => false);
});

global.exports('execute', (query, parameters, callback, resource) => {
  const invokingResource = resource || global.GetInvokingResource();
  let sql = query;
  let values = parameters;
  let cb = callback;
  [sql, values, cb] = sanitizeInput(sql, values, cb);

  mysql.execute({ sql, values, typeCast }, invokingResource).then((result) => {
    safeInvoke(cb, result);
    return true;
  }).catch(() => false);
});

global.exports('transaction', (querys, values, callback, resource) => {
  const invokingResource = resource || global.GetInvokingResource();
  let sqls = [];
  let cb = callback;
  // start by type-checking and sorting the data
  [sqls, cb] = sanitizeTransactionInput(querys, values, cb);
  // the real transaction can begin
  mysql.beginTransaction((connection) => {
    if (!connection) safeInvoke(cb, false);
    const promises = [];
    // execute each query on the connection
    sqls.forEach((element) => {
      promises.push(mysql.execute({
        sql: element.query,
        values: element.values,
      }, invokingResource, connection));
    });
    // commit transaction
    mysql.commitTransaction(promises, connection, (result) => {
      safeInvoke(cb, result);
    });
  });
});

global.onNet(`${currentResourceName}:request-data`, () => {
  const src = global.source;
  global.emitNet(`${currentResourceName}:update-resource-data`, src, profiler.profiles.resources);
  global.emitNet(`${currentResourceName}:update-time-data`, src, profiler.profiles.executionTimes);
  global.emitNet(`${currentResourceName}:update-slow-queries`, src, profiler.profiles.slowQueries);
});
