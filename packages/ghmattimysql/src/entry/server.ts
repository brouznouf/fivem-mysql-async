import { parseUrl } from 'mysql/lib/ConnectionConfig';
import Profiler from '../server/profiler';
import Logger from '../server/logger';
import MySQL from '../server/mysql';
import QueryStorage from '../server/queryStorage';
import {
  sanitizeInput, safeInvoke, typeCast, sanitizeTransactionInput,
} from '../server/utils';

const profiler = new Profiler({
  trace: GetConvarInt('mysql_debug', 0) > 0,
  slowQueryWarningTime: GetConvarInt('mysql_slow_query_warning', 100),
});

const currentResourceName: string = GetCurrentResourceName();

const config = JSON.parse(LoadResourceFile(currentResourceName, 'config.json'));
const configFromString = parseUrl(GetConvar('mysql_connection_string', 'mysql://localhost/fivem'));

const mysql = new MySQL(config || configFromString, profiler);

global.exports('store', (query: string, callback: any) => {
  const invokingResource = GetInvokingResource();
  const storageId = QueryStorage.add(query);
  Logger.log(`\x1b[36m[ghmattimysql]\x1b[0m [${invokingResource}] Stored [${storageId}] : ${query}`);
  safeInvoke(callback, storageId);
});

// need to use global.exports, as otherwise babel-loader will not recognize the scope.
global.exports('scalar', (query: string | number, parameters?: any, callback?: any, resource?: string): void => {
  const invokingResource = resource || GetInvokingResource();
  let sql = QueryStorage.get(query);
  let values = parameters;
  let cb = callback;
  [sql, values, cb] = sanitizeInput(sql, values, cb);

  mysql.execute({ sql, values, typeCast }, invokingResource).then((result) => {
    safeInvoke(cb, (result && result[0]) ? Object.values(result[0])[0] : null);
    return true;
  }).catch(() => false);
});

global.exports('execute', (query: string | number, parameters?: any, callback?: any, resource?: string): void => {
  const invokingResource = resource || GetInvokingResource();
  let sql = QueryStorage.get(query);
  let values = parameters;
  let cb = callback;
  [sql, values, cb] = sanitizeInput(sql, values, cb);

  mysql.execute({ sql, values, typeCast }, invokingResource).then((result) => {
    safeInvoke(cb, result);
    return true;
  }).catch(() => false);
});

global.exports('transaction', (querys, values, callback, resource?: string) => {
  const invokingResource = resource || GetInvokingResource();
  let sqls = [];
  let cb = callback;
  // start by type-checking and sorting the data
  [sqls, cb] = sanitizeTransactionInput(querys, values, cb);
  // the real transaction can begin
  mysql.beginTransaction((connection) => {
    if (!connection) safeInvoke(cb, false);
    const promises = [];
    // execute each query on the connection
    sqls.forEach((element) => {
      promises.push(mysql.execute({
        sql: element.query,
        values: element.values,
      }, invokingResource, connection));
    });
    // commit transaction
    mysql.commitTransaction(promises, connection, (result) => {
      safeInvoke(cb, result);
    });
  });
});

RegisterCommand('mysql:debug', () => {
  profiler.config.trace = !profiler.config.trace;
  console.log(`\x1b[36m[ghmattimysql]\x1b[0m display debug: ${profiler.config.trace}`);
}, true);

onNet(`${currentResourceName}:request-data`, () => {
  const src = source;
  emitNet(`${currentResourceName}:update-resource-data`, src, profiler.profiles.resources);
  emitNet(`${currentResourceName}:update-time-data`, src, profiler.profiles.executionTimes);
  emitNet(`${currentResourceName}:update-slow-queries`, src, profiler.profiles.slowQueries);
});
