const mysql = require('mysql');

function formatVersion(versionString) {
  let versionPrefix = 'MariaDB';
  const version = versionString;
  if (version[0] === '5' || version[0] === '8') {
    versionPrefix = 'MySQL';
  }
  return { versionPrefix, version };
}

class MySQL {
  constructor(mysqlConfig, logger, profiler) {
    this.pool = null;
    this.profiler = profiler;
    this.logger = logger;
    this.formatQuery = sql => `${sql.sql} : ${JSON.stringify(sql.values)}`;

    if (typeof mysqlConfig === 'object') {
      this.pool = mysql.createPool(mysqlConfig);
    } else {
      this.logger.error(`[ERROR] [MySQL] Unexpected configuration of type ${typeof mysqlconfig} received.`);
    }

    this.pool.query('SELECT VERSION()', (error, result) => {
      if (!error) {
        const { versionPrefix, version } = formatVersion(result[0]['VERSION()']);
        profiler.setVersion(`${versionPrefix}:${version}`);
        logger.log('\x1b[32m[ghmattimysql]\x1b[0m Database server connection established.');
      } else {
        logger.error(`[ERROR] ${error.message}`);
      }
    });
  }

  execute(sql, invokingResource, connection) {
    const queryPromise = new Promise((resolve, reject) => {
      const start = process.hrtime();
      const db = connection || this.pool;

      db.query(sql, (error, result) => {
        this.profiler.profile(process.hrtime(start), this.formatQuery(sql), invokingResource);
        if (error) reject(error);
        resolve(result);
      });
    }).catch((error) => {
      this.logger.error(`[ERROR] [${this.profiler.version}] [${invokingResource}] An error happens on MySQL for query "${this.formatQuery(sql)}": ${error.message}`);
    });

    return queryPromise;
  }
}

module.exports = MySQL;
