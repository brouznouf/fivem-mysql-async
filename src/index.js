const mysql = require('mysql2');

const config = JSON.parse(global.LoadResourceFile('ghmattimysql', 'config.json'));

const pool = mysql.createPool({
  host: config.server,
  port: config.port,
  user: config.username,
  database: config.database,
  password: config.password,
  connectionLimit: config.connectionLimit,
});

function prepareLegacyQuery(query, parameters) {
  let sql = query;
  if (parameters !== null && typeof parameters === 'object') {
    sql = query.replace(/@(\w+)/g, (txt, key) => {
      if (Object.prototype.hasOwnProperty.call(parameters, key)) {
        return mysql.escape(parameters[key]);
      }
      return txt;
    });
  }
  return sql;
}

function sanitizeInput(query, parameters, callback) {
  let sql = query;
  let params = parameters;
  let cb = callback;

  if (typeof parameters === 'function') {
    cb = parameters;
  }
  sql = prepareLegacyQuery(query, parameters);
  if (!Array.isArray(parameters)) {
    params = [];
  }
  return [sql, params, cb];
}

async function safeInvoke(callback, args) {
  if (typeof callback === 'function') {
    setImmediate(() => {
      callback(args);
    });
  }
}

function execute(sql, params, connection) {
  const orm = connection || pool;
  return new Promise((resolve, reject) => {
    orm.execute(sql, params, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
}

global.exports('scalar', (query, parameters, callback) => {
  let sql = query;
  let params = parameters;
  let cb = callback;
  [sql, params, cb] = sanitizeInput(sql, params, cb);

  execute(sql, params).then((result) => {
    safeInvoke(cb, Object.values(result[0])[0]);
  });
});

global.exports('execute', (query, parameters, callback) => {
  let sql = query;
  let params = parameters;
  let cb = callback;
  [sql, params, cb] = sanitizeInput(sql, params, cb);

  execute(sql, params).then((result) => {
    safeInvoke(cb, result);
  });
});

global.exports('transaction', (querys, parameters, callback) => {
  let sqls = [];
  let params;
  let cb;
  // start by type-checking and sorting the data
  if (!querys.every(element => typeof element === 'string')) {
    sqls = querys;
    if (typeof parameters === 'function') cb = parameters;
  } else {
    if (typeof parameters === 'function') {
      cb = parameters;
      params = [];
    } else {
      params = parameters;
      cb = callback;
    }
    querys.forEach((element) => {
      sqls.push({ query: element, parameters: params });
    });
  }
  // build the actual queries
  sqls.forEach((element, index) => {
    sqls[index] = { query: prepareLegacyQuery(element.query, element.parameters), parameters: [] };
  });

  // the real transaction can begin
  pool.getConnection((connectionError, connection) => {
    if (connectionError) {
      console.error(connectionError);
      safeInvoke(cb, false);
      return;
    }

    connection.beginTransaction((transactionError) => {
      if (transactionError) {
        connection.rollback(() => {
          console.error(transactionError);
          safeInvoke(cb, false);
        });
        return;
      }

      const promises = [];

      // execute each query on the connection
      sqls.forEach((element) => {
        promises.push(execute(element.query, element.parameters, connection));
      });

      // If all have resolved, then commit
      Promise.all(promises).then(() => {
        connection.commit((commitError) => {
          if (commitError) {
            connection.rollback(() => {
              console.error(commitError);
              safeInvoke(cb, false);
            });
          }
          safeInvoke(cb, true);
        });
        // Otherwise catch the error from the execution
      }).catch((executeError) => {
        connection.rollback(() => {
          console.error(executeError);
          safeInvoke(cb, false);
        });
      });
    });
  });
});
