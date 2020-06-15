import { PoolConfig } from 'mysql';
import CFXCallback from './types/cfxCallback';
import { sanitizeInput, typeCast, sanitizeTransactionInput } from './utility';
import MySQL from './mysql';
import QueryStringStorage from './queryStorage';
import Logger from './logger';
import Profiler from './profiler';
import queryStorage from './queryStore';

class Server {
  logger: Logger;

  profiler: Profiler;

  mysql: MySQL;

  queryStorage: QueryStringStorage;

  constructor(config: PoolConfig) {
    this.logger = new Logger(GetConvar('mysql_debug', 'None'));
    this.profiler = new Profiler({ slowQueryWarningTime: GetConvarInt('mysql_slow_query_warning', 150) }, this.logger);
    this.mysql = new MySQL(config, this.profiler, this.logger);
    this.queryStorage = queryStorage;
  }

  execute(query: string | number, parameters: any | CFXCallback, callback: any | CFXCallback, resource: string) {
    let sql = this.queryStorage.get(query);
    let values = parameters;
    let cb = callback;
    [sql, values, cb] = sanitizeInput(sql, values, cb);

    return new Promise<[unknown, CFXCallback]>((resolve) => {
      this.mysql.execute({ sql, values, typeCast }, resource).then((result) => {
        resolve([result, cb]);
      });
    });
  }

  transaction(querys, values: any | CFXCallback, callback: any | CFXCallback, resource: string) {
    let sqls = [];
    let cb = callback;
    // start by type-checking and sorting the data
    [sqls, cb] = sanitizeTransactionInput(querys, values, cb);
    // the real transaction can begin
    return new Promise<[boolean, CFXCallback]>((resolve) => {
      this.mysql.beginTransaction((connection) => {
        if (!connection) resolve([false, cb]);
        const promises = [];
        // execute each query on the connection
        sqls.forEach((element) => {
          promises.push(this.mysql.execute({
            sql: element.query,
            values: element.values,
          }, resource, connection));
        });
        // commit transaction
        this.mysql.commitTransaction(promises, connection, (result: any) => {
          resolve([result, cb]);
        });
      });
    });
  }
}

export default Server;
