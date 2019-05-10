const MySQL = require('./mysql.js');
const Logger = require('./logger.js');
const Profiler = require('./profiler.js');
const parseSettings = require('./settings.js');
const { prepareQuery, typeCast, safeInvoke } = require('./utils.js');

let logger = null;
let profiler = null;
let mysql = null;
let config = {};

global.exports('mysql_execute', (query, parameters, callback) => {
  const invokingResource = global.GetInvokingResource();
  const sql = prepareQuery(query, parameters);
  mysql.execute({ sql, typeCast }, invokingResource).then((result) => {
    safeInvoke(callback, (result) ? result.affectedRows : 0);
  });
});

global.exports('mysql_fetch_all', (query, parameters, callback) => {
  const invokingResource = global.GetInvokingResource();
  const sql = prepareQuery(query, parameters);
  mysql.execute({ sql, typeCast }, invokingResource).then((result) => {
    safeInvoke(callback, result);
  });
});

global.exports('mysql_fetch_scalar', (query, parameters, callback) => {
  const invokingResource = global.GetInvokingResource();
  const sql = prepareQuery(query, parameters);
  mysql.execute({ sql, typeCast }, invokingResource).then((result) => {
    safeInvoke(callback, (result && result[0]) ? Object.values(result[0])[0] : null);
  });
});

global.exports('mysql_insert', (query, parameters, callback) => {
  const invokingResource = global.GetInvokingResource();
  const sql = prepareQuery(query, parameters);
  mysql.execute({ sql, typeCast }, invokingResource).then((result) => {
    safeInvoke(callback, (result) ? result.insertId : 0);
  });
});

let isReady = false;
global.on('onServerResourceStart', (resourcename) => {
  if (resourcename === 'mysql-async') {
    const trace = global.GetConvarInt('mysql_debug', 0);
    const slowQueryWarningTime = global.GetConvarInt('mysql_slow_query_warning', 200);

    logger = new Logger(global.GetConvar('mysql_debug_output', 'console'));
    profiler = new Profiler(logger, { trace, slowQueryWarningTime });

    // needs to move to a new file
    const connectionString = global.GetConvar('mysql_connection_string', 'Empty');
    if (connectionString === 'Empty') {
      logger.Error('Empty mysql_connection_string detected.');
      throw new Error('Empty mysql_connection_string detected.');
    }
    config = parseSettings(connectionString);

    mysql = new MySQL(config, logger, profiler);
    global.emit('onMySQLReady'); // avoid ESX bugs
    isReady = true;
  }
  if (isReady) {
    global.emit('MySQLReady'); // avoid ESX bugs
  }
});
