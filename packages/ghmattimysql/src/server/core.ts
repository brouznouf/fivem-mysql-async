import { parseUrl } from 'mysql/lib/ConnectionConfig';
import Logger from './logger';
import Profiler from './profiler';
import MySQL from './mysql';
import QueryStringStorage from './queryStorage';

const logger = new Logger(GetConvar('mysql_debug', 'None'));
const profiler = new Profiler({ slowQueryWarningTime: GetConvarInt('mysql_slow_query_warning', 150) }, logger);

const currentResourceName = GetCurrentResourceName();
const config = JSON.parse(LoadResourceFile(currentResourceName, 'config.json'));
const configFromString = parseUrl(GetConvar('mysql_connection_string', 'mysql://localhost/fivem'));

const mysql = new MySQL(config || configFromString, profiler, logger);

const queryStorage = new QueryStringStorage();

export {
  logger,
  profiler,
  mysql,
  queryStorage,
};
