import { safeInvoke } from '../server/utility';
import CFXCallback from '../server/types/cfxCallback';
import { OutputDestination } from '../server/logger/loggerConfig';
import Server from '../server';
import getConfig from '../server/utility/getConfig';

const server = new Server(getConfig());

global.exports('store', (query: string, callback: CFXCallback) => {
  const invokingResource = GetInvokingResource();
  const storageId = server.queryStorage.add(query);
  server.logger.info(`[${invokingResource}] Stored [${storageId}] : ${query}`);
  safeInvoke(callback, storageId);
});

// need to use global.exports, as otherwise babel-loader will not recognize the scope.
global.exports('scalar', (query: string | number, parameters?: any | CFXCallback, callback?: any | CFXCallback, resource?: string): void => {
  const invokingResource = resource || GetInvokingResource();
  server.execute(query, parameters, callback, invokingResource).then(([result, cb]) => {
    safeInvoke(cb, (result && result[0]) ? Object.values(result[0])[0] : null);
    return true;
  }).catch(() => false);
});

global.exports('execute', (query: string | number, parameters?: any | CFXCallback, callback?: CFXCallback, resource?: string): void => {
  const invokingResource = resource || GetInvokingResource();
  server.execute(query, parameters, callback, invokingResource).then(([result, cb]) => {
    safeInvoke(cb, result);
    return true;
  }).catch(() => false);
});

global.exports('transaction', (querys, values?: any | CFXCallback, callback?: CFXCallback, resource?: string) => {
  const invokingResource = resource || GetInvokingResource();
  server.transaction(querys, values, callback, invokingResource).then(([result, cb]) => {
    safeInvoke(cb, result);
    return true;
  }).catch(() => false);
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

onNet('ghmattimysql:request-data', () => {
  const src = source;
  emitNet('ghmattimysql:update-resource-data', src, server.profiler.profiles.resources);
  emitNet('ghmattimysql:update-time-data', src, server.profiler.profiles.executionTimes);
  emitNet('ghmattimysql:update-slow-queries', src, server.profiler.profiles.slowQueries);
});
