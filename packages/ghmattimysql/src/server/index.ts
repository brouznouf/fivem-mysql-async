import CFXCallback from './types/cfxCallback';
import { queryStorage, mysql } from './core';
import { sanitizeInput, typeCast, sanitizeTransactionInput } from './utility';

function execute(query: string | number, parameters: any | CFXCallback, callback: any | CFXCallback, resource: string) {
  let sql = queryStorage.get(query);
  let values = parameters;
  let cb = callback;
  [sql, values, cb] = sanitizeInput(sql, values, cb);

  return new Promise<[unknown, CFXCallback]>((resolve) => {
    mysql.execute({ sql, values, typeCast }, resource).then((result) => {
      resolve([result, cb]);
    });
  });
}

function transaction(querys, values: any | CFXCallback, callback: any | CFXCallback, resource: string) {
  let sqls = [];
  let cb = callback;
  // start by type-checking and sorting the data
  [sqls, cb] = sanitizeTransactionInput(querys, values, cb);
  // the real transaction can begin
  return new Promise<[boolean, CFXCallback]>((resolve) => {
    mysql.beginTransaction((connection) => {
      if (!connection) resolve([false, cb]);
      const promises = [];
      // execute each query on the connection
      sqls.forEach((element) => {
        promises.push(mysql.execute({
          sql: element.query,
          values: element.values,
        }, resource, connection));
      });
      // commit transaction
      mysql.commitTransaction(promises, connection, (result: any) => {
        resolve([result, cb]);
      });
    });
  });
}

export { execute, transaction };
