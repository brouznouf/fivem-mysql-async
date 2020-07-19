import { OkPacket } from 'mysql';
import { safeInvoke } from '../vendor/ghmattimysql/packages/ghmattimysql/src/server/utility';
import CFXCallback from '../vendor/ghmattimysql/packages/ghmattimysql/src/server/types/cfxCallback';
import { OutputDestination } from '../vendor/ghmattimysql/packages/ghmattimysql/src/server/logger/loggerConfig';
import Server from '../vendor/ghmattimysql/packages/ghmattimysql/src/server';
import getConfig from '../vendor/ghmattimysql/packages/ghmattimysql/src/server/utility/getConfig';

const defaultCfg = {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'fivem',
  supportBigNumbers: true,
  multipleStatements: true,
};

// Switch to just connecting immediately
const config = { ...defaultCfg, ...getConfig() };
const server = new Server(config, { tag: 'mysql-async' });

let isReady = false;
global.exports('is_ready', () => isReady);

on('onResourceStart', (resourcename) => {
  // avoid old bugs
  if (resourcename === 'mysql-async') {
    emit('onMySQLReady');
    isReady = true;
    if ((<any>config).keepAlive) {
      setInterval(() => {
        server.execute('SELECT 1', [], null, 'mysql-async:keepAlive');
      }, (<any>config).keepAlive * 1000);
    }
  }
});

global.exports('mysql_execute', (query: string | number, parameters?: any | CFXCallback, callback?: any | CFXCallback, resource?: string): void => {
  const invokingResource = resource || GetInvokingResource();
  server.execute(query, parameters, callback, invokingResource).then(([result, cb]) => {
    safeInvoke(cb, (result) ? (<OkPacket>result).affectedRows : 0);
    return true;
  }).catch(() => false);
});

global.exports('mysql_fetch_all', (query: string | number, parameters?: any | CFXCallback, callback?: any | CFXCallback, resource?: string): void => {
  const invokingResource = resource || GetInvokingResource();
  server.execute(query, parameters, callback, invokingResource).then(([result, cb]) => {
    safeInvoke(callback, result);
    return true;
  }).catch(() => false);
});

global.exports('mysql_fetch_scalar', (query: string | number, parameters?: any | CFXCallback, callback?: any | CFXCallback, resource?: string): void => {
  const invokingResource = resource || GetInvokingResource();
  server.execute(query, parameters, callback, invokingResource).then(([result, cb]) => {
    safeInvoke(cb, (result && result[0]) ? Object.values(result[0])[0] : null);
    return true;
  }).catch(() => false);
});

global.exports('mysql_insert', (query: string | number, parameters?: any | CFXCallback, callback?: any | CFXCallback, resource?: string): void => {
  const invokingResource = resource || GetInvokingResource();
  server.execute(query, parameters, callback, invokingResource).then(([result, cb]) => {
    safeInvoke(cb, (result) ? (<OkPacket>result).insertId : 0);
    return true;
  }).catch(() => false);
});

global.exports('mysql_transaction', (querys, values?: any | CFXCallback, callback?: CFXCallback, resource?: string) => {
  const invokingResource = resource || GetInvokingResource();
  server.transaction(querys, values, callback, invokingResource).then(([result, cb]) => {
    safeInvoke(cb, result);
    return true;
  }).catch(() => false);
});

global.exports('mysql_store', (query: string, callback: CFXCallback) => {
  const invokingResource = GetInvokingResource();
  const storageId = server.queryStorage.add(query);
  server.logger.info(`[${invokingResource}] Stored [${storageId}] : ${query}`);
  safeInvoke(callback, storageId);
});

RegisterCommand('mysql:debug', () => {
  let trace = false;
  if (server.logger.defaultConfig.output === OutputDestination.FileAndConsole
    || server.logger.defaultConfig.output === OutputDestination.Console) {
    server.logger.defaultConfig.output = OutputDestination.File;
  } else {
    server.logger.defaultConfig.output = OutputDestination.FileAndConsole;
    trace = true;
  }
  server.logger.info(`display debug: ${trace}`);
}, true);

onNet('mysql-async:request-data', () => {
  const src = source;
  emitNet('mysql-async:update-resource-data', src, server.profiler.profiles.resources);
  emitNet('mysql-async:update-time-data', src, server.profiler.profiles.executionTimes);
  emitNet('mysql-async:update-slow-queries', src, server.profiler.profiles.slowQueries);
});

onNet('mysql-async:request-server-status', () => {
  const src = source;
  server.execute('SHOW GLOBAL STATUS', (data: unknown) => {
    emitNet('mysql-async:update-status', src, data);
  }, null, 'mysql-async').then(([result, cb]) => {
    cb(result);
  }).catch(() => false);
  server.execute('SHOW GLOBAL VARIABLES', (data: unknown) => {
    emitNet('mysql-async:update-variables', src, data);
  }, null, 'mysql-async').then(([result, cb]) => {
    cb(result);
  }).catch(() => false);
});
