const mysql = require('mysql');

class MySQL {
  constructor(mysqlConfig, logger, profiler) {
    this.pool = null;
    this.profiler = profiler;
    this.logger = logger;
    if (typeof mysqlConfig === 'string' || typeof mysqlConfig === 'object') {
      this.pool = mysql.createPool(mysqlConfig);
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
    });

    queryPromise.catch((error) => {
      this.logger.error(`[ERROR] [MySQL] [${invokingResource}] An error happens on MySQL for query "${sql.sql}": ${error.message}`);
    });

    return queryPromise;
  }
}

module.exports = MySQL;
