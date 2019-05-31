const mysql = require('mysql');

class MySQL {
  constructor(mysqlConfig, logger, profiler) {
    this.pool = null;
    this.profiler = profiler;
    this.logger = logger;
    if (typeof mysqlConfig === 'object') {
      this.pool = mysql.createPool(mysqlConfig);
    } else {
      this.logger.error(`[ERROR] [MySQL] Unexpected configuration of type ${typeof mysqlconfig} received.`);
    }

    this.pool.query('SELECT VERSION()', (error, result) => {
      let versionPrefix = 'MariaDB';
      if (!error) {
        const version = result[0]['VERSION()'];
        if (version[0] === '5' || version[0] === '8') {
          versionPrefix = 'MySQL';
        }
        profiler.setVersion(`${versionPrefix}:${version}`);
        logger.log('\x1b[32m[mysql-async]\x1b[0m Database server connection established.');
      } else {
        logger.error(`[ERROR] ${error.message}`);
      }
    });

    // for people with faulty network configurations, to keep the handle for timing out
    // might be some tcp / udp issue
    if (mysqlConfig.keepAlive) {
      this.ping(Number(mysqlConfig.keepAlive));
    }
  }

  // for people with faulty network configurations, to keep the handle for timing out
  // might be some tcp / udp issue
  // actual function that keeps the connection alive
  ping(keepAliveTimeout) {
    if (keepAliveTimeout && keepAliveTimeout > 0) {
      this.execute({ sql: 'SELECT 1' }, 'mysql-async:keepAlive').then(() => {
        setTimeout(() => this.ping(keepAliveTimeout), keepAliveTimeout * 1000);
      });
    }
  }

  execute(sql, invokingResource, connection) {
    const queryPromise = new Promise((resolve, reject) => {
      const start = process.hrtime();
      const db = connection || this.pool;

      db.query(sql, (error, result) => {
        this.profiler.profile(process.hrtime(start), sql.sql, invokingResource);
        if (error) reject(error);
        resolve(result);
      });
    }).catch((error) => {
      this.logger.error(`[ERROR] [MySQL] [${invokingResource}] An error happens on MySQL for query "${sql.sql}": ${error.message}`);
    });

    return queryPromise;
  }
}

module.exports = MySQL;
