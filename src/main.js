const MySQL = require('./mysql.js');
const Logger = require('./logger.js');
const Profiler = require('./profiler.js');
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

function parseOptions(settings, options) {
  const cfg = settings;
  const opts = options.split('&');
  opts.forEach((o) => {
    const keyValue = o.split('=');
    [, cfg[keyValue[0]]] = keyValue;
  });
  return cfg;
}

function parseConnectingString(connectionString) {
  let cfg = null;
  if (/(?:database|initial\scatalog)=(?:(.*?);|(.*))/gi.test(connectionString)) {
    let matches = (/(?:host|server|data\s?source|addr(?:ess)?)=(?:(.*?);|(.*))/gi.exec(connectionString));
    const host = (matches) ? matches[1] || matches[2] : 'localhost';
    matches = (/(?:Port)=(?:(.*?);|(.*))/gi.exec(connectionString));
    const port = (matches) ? matches[1] || matches[2] : 3306;
    matches = (/(?:user\s?(?:id|name)?|uid)=(?:(.*?);|(.*))/gi.exec(connectionString));
    const user = (matches) ? matches[1] || matches[2] : 'root';
    matches = (/(?:password|pwd)=(?:(.*?);|(.*))/gi.exec(connectionString));
    const password = (matches) ? matches[1] || matches[2] : '';
    matches = (/(?:database|initial\scatalog)=(?:(.*?);|(.*))/gi.exec(connectionString));
    const database = (matches) ? matches[1] || matches[2] : '';
    cfg = {
      host,
      port,
      user,
      password,
      database,
      supportBigNumbers: true,
      multipleStatements: true,
    };
  } else if (/mysql:\/\//gi.test(connectionString)) {
    const matches = /mysql:\/\/(.*?)(?::|@)(?:(.*)@)?(.*?)(?::(\d{1,5}))?\/(.*?)\?(.*)/gi.exec(connectionString);
    const host = (matches[3]) ? matches[3] : 'localhost';
    const port = (matches[4]) ? matches[4] : 3306;
    const user = (matches[1]) ? matches[1] : 'root';
    const password = (matches[2]) ? matches[2] : '';
    const database = (matches[5]) ? matches[5] : '';
    const settings = {
      host, port, user, password, database,
    };
    const options = matches[6];
    cfg = parseOptions(settings, options);
  } else throw new Error('No valid connection string found');

  return cfg;
}

let isReady = false;
global.on('onServerResourceStart', (resourcename) => {
  if (resourcename === 'mysql-async') {
    const trace = global.GetConvarInt('mysql_debug', 0);
    const slowQueryWarningTime = global.GetConvarInt('mysql_slow_query_warning', 200);

    logger = new Logger(global.GetConvar('mysql_debug_output', 'console'));
    profiler = new Profiler(logger, { trace, slowQueryWarningTime });

    // needs to move to a new file
    const connectionString = global.GetConvar('mysql_connection_string', 'Empty');
    if (connectionString === 'Empty') throw new Error('Empty mysql_connection_string detected.');
    config = parseConnectingString(connectionString);

    mysql = new MySQL(config, logger, profiler);
    global.emit('onMySQLReady'); // avoid ESX bugs
    isReady = true;
  }
  if (isReady) {
    global.emit('MySQLReady'); // avoid ESX bugs
  }
});
