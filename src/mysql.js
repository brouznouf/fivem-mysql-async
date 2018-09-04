const mysql = require('mysql');

let connectionString = '';
let debug = 0;
let pool;

function prepareQuery(query, parameters) {
    let sql = query;
    if (parameters !== null && typeof parameters === 'object') {
        sql = query.replace(/@(\w+)/g, (txt, key) => {
            if (parameters.hasOwnProperty(key)) {
                return mysql.escape(parameters[key]);
            } else if (parameters.hasOwnProperty(`@${key}`)) {
                return mysql.escape(parameters[`@${key}`]);
            }
            return txt;
        });
    }
    return sql;
}

function writeDebug(time, sql, error) {
    if (error) console.log(`[ERROR] [MySQL] An error happens on MySQL for query "${sql}": ${error.message}`)
    if (debug) console.log(`[MySQL] [${(time[0]*1e3+time[1]*1e-6).toFixed()}ms] ${sql}`);
}

async function safeInvoke(callback, args) {
    await new global.Promise(resolve => setTimeout(resolve, 0));
    if (typeof callback === 'function') callback(args);
}

global.exports('mysql_execute', (query, parameters, callback) => {
    let sql = prepareQuery(query, parameters);
    let start = process.hrtime();
    pool.query(sql, (error, results) => {
        writeDebug(process.hrtime(start), sql, error);
        safeInvoke(callback, (results) ? results.affectedRows : 0);
    });
});

global.exports('mysql_fetch_all', (query, parameters, callback) => {
    let sql = prepareQuery(query, parameters);
    let start = process.hrtime();
    pool.query(sql, (error, results) => {
        writeDebug(process.hrtime(start), sql, error);
        safeInvoke(callback, results);
    });
});

global.exports('mysql_fetch_scalar', (query, parameters, callback) => {
    let sql = prepareQuery(query, parameters);
    let start = process.hrtime();
    pool.query(sql, (error, results) => {
        writeDebug(process.hrtime(start), sql, error);
        safeInvoke(callback, (results) ? Object.values(results[0])[0] : null);
    });
});

global.exports('mysql_insert', (query, parameters, callback) => {
    let sql = prepareQuery(query, parameters);
    let start = process.hrtime();
    pool.query(sql, (error, results) => {
        writeDebug(process.hrtime(start), sql, error);
        safeInvoke(callback, (results) ? results.insertId : 0);
    });
});

global.on('onServerResourceStart', (resourcename) => {
    if (resourcename == 'mysql-async') {
        connectionString = global.GetConvar('mysql_connection_string', 'mysql://localhost/');
        debug = global.GetConvarInt('mysql_debug', 0);
        pool = mysql.createPool(connectionString);
        global.emit('onMySQLReady');
    }
});
