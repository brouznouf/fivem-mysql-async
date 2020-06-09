import {
  createPool, Pool, PoolConnection, QueryOptions, MysqlError, PoolConfig,
} from 'mysql';
import Logger from '../logger';
import Profiler from '../profiler';

function formatVersion(versionString: string) {
  let versionPrefix = 'MariaDB';
  const version = versionString;
  if (version[0] === '5' || version[0] === '8') {
    versionPrefix = 'MySQL';
  }
  return { versionPrefix, version };
}

class MySQL {
  pool: Pool;

  profiler: Profiler;

  formatQuery: any;

  constructor(mysqlConfig: PoolConfig | string, profiler: Profiler) {
    this.pool = null;
    this.profiler = profiler;
    this.formatQuery = (sql: QueryOptions): string => `${sql.sql} : ${JSON.stringify(sql.values)}`;

    if (typeof mysqlConfig === 'object') {
      this.pool = createPool(mysqlConfig);
    } else {
      Logger.error(`[ERROR] [MySQL] Unexpected configuration of type ${typeof mysqlConfig} received.`);
    }

    this.pool.query('SELECT VERSION()', (error, result) => {
      if (!error) {
        const formattedVersion = formatVersion(result[0]['VERSION()']);
        profiler.setVersion(formattedVersion);
        Logger.log('\x1b[32m[ghmattimysql]\x1b[0m Database server connection established.');
      } else {
        Logger.error(`[ERROR] ${error.message}`);
      }
    });
  }

  execute(sql: QueryOptions, invokingResource: string, connection?: PoolConnection) {
    const queryPromise = new Promise((resolve, reject) => {
      const start = process.hrtime();
      const db = connection || this.pool;

      db.query(sql, (error, result) => {
        this.profiler.profile(process.hrtime(start), this.formatQuery(sql), invokingResource);
        if (error) reject(error);
        resolve(result);
      });
    }).catch((error) => {
      Logger.error(`[ERROR] [${this.profiler.version}] [${invokingResource}] An error happens on MySQL for query "${this.formatQuery(sql)}": ${error.message}`);
      // We should not catch this error when doing a transaction, throw new error instead.
      if (connection) throw new Error('This error might result from a transaction and be deliberate.');
    });

    return queryPromise;
  }

  onTransactionError(error: MysqlError, connection: PoolConnection, callback) {
    connection.rollback(() => {
      Logger.error(error.message);
      callback(false);
    });
  }

  beginTransaction(callback) {
    this.pool.getConnection((connectionError, connection) => {
      if (connectionError) {
        Logger.error(connectionError.message);
        callback(false);
        return;
      }
      connection.beginTransaction((transactionError) => {
        if (transactionError) this.onTransactionError(transactionError, connection, callback);
        else callback(connection);
      });
    });
  }

  commitTransaction(promises: Promise<unknown>[], connection: PoolConnection, callback) {
    Promise.all(promises).then(() => {
      connection.commit((commitError) => {
        if (commitError) this.onTransactionError(commitError, connection, callback);
        else callback(true);
      });
      // Otherwise catch the error from the execution
    }).catch((executeError) => {
      this.onTransactionError(executeError, connection, callback);
    }).then(() => {
      // terminate connection
      connection.release();
    });
  }
}

export default MySQL;
