const mysql = require('mysql');

const config = JSON.parse(global.LoadResourceFile('ghmattimysql', 'config.json'));
const configString = global.GetConvar('mysql_connection_string', 'mysql://localhost/fivem');
const useBoolean = global.GetConvarInt('mysql_use_boolean', 0);
const showDebug = global.GetConvarInt('mysql_debug', 0);
const pool = mysql.createPool(config || configString);

function prepareLegacyQuery(query, parameters) {
  let sql = query;
  let params = parameters;
  if (params !== null && typeof params === 'object' && !Array.isArray(params)) {
    params = [];
    sql = sql.replace(/@(\w+)/g, (txt, key) => {
      if (Object.prototype.hasOwnProperty.call(parameters, txt)) {
        params.push(parameters[txt]);
        return '?';
      }
      return txt;
    });
  }
  return [sql, params];
}

function transformToBoolean(fields, result) {
  const res = result;
  if (fields) {
    fields.forEach((field) => {
      if (field.columnType === 1 && field.columnLength === 1) {
        result.forEach((_, index) => {
          res[index][field.name] = (result[index][field.name] !== 0);
        });
      }
    });
  }
  return res;
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
    orm.query(sql, params, (error, result, fields) => {
      if (showDebug) console.log(`[MySQL] ${sql} : ${JSON.stringify(params)}`);
      if (error) reject(error);
      resolve((useBoolean) ? transformToBoolean(fields, result) : result);
    });
  });
}

global.exports('scalar', (query, parameters, callback) => {
  let sql = query;
  let params = parameters;
  let cb = callback;
  [sql, params, cb] = sanitizeInput(sql, params, cb);

  execute(sql, params).then((result) => {
    safeInvoke(cb, Object.values(result[0] || {})[0]);
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

function onTransactionError(error, connection, callback) {
  connection.rollback(() => {
    console.error(error);
    safeInvoke(callback, false);
  });
}

global.exports('transaction', (querys, parameters, callback) => {
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
  pool.getConnection((connectionError, connection) => {
    if (connectionError) {
      console.error(connectionError);
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
        promises.push(execute(element.query, element.parameters, connection));
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
