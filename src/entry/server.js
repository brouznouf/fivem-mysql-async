const { parseUrl } = require('mysql/lib/ConnectionConfig');
const Profiler = require('../server/profiler.js');
const Logger = require('../server/logger.js');
const MySQL = require('../server/mysql.js');
const {
  typeCast, safeInvoke, prepareLegacyQuery, sanitizeInput,
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
  });
});

global.exports('execute', (query, parameters, callback, resource) => {
  const invokingResource = resource || global.GetInvokingResource();
  let sql = query;
  let values = parameters;
  let cb = callback;
  [sql, values, cb] = sanitizeInput(sql, values, cb);

  mysql.execute({ sql, values, typeCast }, invokingResource).then((result) => {
    safeInvoke(cb, result);
  });
});

function onTransactionError(error, connection, callback) {
  connection.rollback(() => {
    logger.error(error.message);
    safeInvoke(callback, false);
  });
}

global.exports('transaction', (querys, parameters, callback, resource) => {
  const invokingResource = resource || global.GetInvokingResource();
  let sqls = [];
  let params = parameters;
  let cb = callback;
  // start by type-checking and sorting the data
  if (!querys.every(element => typeof element === 'string')) {
    sqls = querys;
    if (typeof parameters === 'function') cb = parameters;
  } else {
    if (typeof parameters === 'function') {
      cb = parameters;
      params = [];
    }
    querys.forEach((element) => {
      sqls.push({ query: element, parameters: params });
    });
  }
  // build the actual queries
  sqls.forEach((element, index) => {
    const [stmt, stmtParams] = prepareLegacyQuery(element.query, element.parameters);
    sqls[index] = {
      query: stmt,
      parameters: (Array.isArray(stmtParams)) ? stmtParams : [],
    };
  });
  // the real transaction can begin
  mysql.pool.getConnection((connectionError, connection) => {
    if (connectionError) {
      logger.error(connectionError.message);
      safeInvoke(cb, false);
      return;
    }
    connection.beginTransaction((transactionError) => {
      if (transactionError) {
        onTransactionError(transactionError, connection, callback);
        return;
      }
      const promises = [];
      // execute each query on the connection
      sqls.forEach((element) => {
        promises.push(mysql.execute({
          sql: element.query,
          values: element.parameters,
        }, invokingResource, connection));
      });
      // If all have resolved, then commit
      Promise.all(promises).then(() => {
        connection.commit((commitError) => {
          if (commitError) {
            onTransactionError(commitError, connection, callback);
          } else safeInvoke(cb, true);
        });
        // Otherwise catch the error from the execution
      }).catch((executeError) => {
        onTransactionError(executeError, connection, callback);
      });
    });
  });
});

global.onNet(`${currentResourceName}:request-data`, () => {
  const src = global.source;
  global.emitNet(`${currentResourceName}:update-resource-data`, src, profiler.profiles.resources);
  global.emitNet(`${currentResourceName}:update-time-data`, src, profiler.profiles.executionTimes);
  global.emitNet(`${currentResourceName}:update-slow-queries`, src, profiler.profiles.slowQueries);
});
