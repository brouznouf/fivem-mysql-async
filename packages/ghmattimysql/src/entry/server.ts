import { safeInvoke, sanitizeTransactionInput } from '../server/utility';
import CFXCallback from '../server/types/cfxCallback';
import { OutputDestination } from '../server/logger/loggerConfig';
import {
  logger, mysql, profiler, queryStorage,
} from '../server/core';
import { execute, transaction } from '../server';

global.exports('store', (query: string, callback: CFXCallback) => {
  const invokingResource = GetInvokingResource();
  const storageId = queryStorage.add(query);
  logger.info(`[${invokingResource}] Stored [${storageId}] : ${query}`);
  safeInvoke(callback, storageId);
});

// need to use global.exports, as otherwise babel-loader will not recognize the scope.
global.exports('scalar', (query: string | number, parameters?: any | CFXCallback, callback?: any | CFXCallback, resource?: string): void => {
  const invokingResource = resource || GetInvokingResource();
  execute(query, parameters, callback, invokingResource).then(([result, cb]) => {
    safeInvoke(cb, (result && result[0]) ? Object.values(result[0])[0] : null);
    return true;
  }).catch(() => false);
});

global.exports('execute', (query: string | number, parameters?: any | CFXCallback, callback?: CFXCallback, resource?: string): void => {
  const invokingResource = resource || GetInvokingResource();
  execute(query, parameters, callback, invokingResource).then(([result, cb]) => {
    safeInvoke(cb, result);
    return true;
  }).catch(() => false);
});

global.exports('transaction', (querys, values?: any | CFXCallback, callback?: CFXCallback, resource?: string) => {
  const invokingResource = resource || GetInvokingResource();
  transaction(querys, values, callback, invokingResource).then(([result, cb]) => {
    safeInvoke(cb, result);
    return true;
  }).catch(() => false);
});

RegisterCommand('mysql:debug', () => {
  let trace = false;
  if (logger.defaultConfig.output === OutputDestination.FileAndConsole
    || logger.defaultConfig.output === OutputDestination.Console) {
    logger.defaultConfig.output = OutputDestination.File;
  } else {
    logger.defaultConfig.output = OutputDestination.FileAndConsole;
    trace = true;
  }
  logger.info(`display debug: ${trace}`);
}, true);

onNet('ghmattimysql:request-data', () => {
  const src = source;
  emitNet('ghmattimysql:update-resource-data', src, profiler.profiles.resources);
  emitNet('ghmattimysql:update-time-data', src, profiler.profiles.executionTimes);
  emitNet('ghmattimysql:update-slow-queries', src, profiler.profiles.slowQueries);
});
