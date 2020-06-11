import { ProfilerConfig, defaultProfilerConfig } from './profilerConfig';
import ExecutionTime from './executionTime';
import Profile from './profile';
import Logger from '../logger';

function updateExecutionTimes(executionTime: ExecutionTime, queryTime: number) {
  let returnObj: ExecutionTime = null;

  if (typeof executionTime !== 'undefined' && executionTime !== null) {
    const { totalExecutionTime, queryCount } = executionTime;

    returnObj = {
      totalExecutionTime: totalExecutionTime + queryTime,
      queryCount: queryCount + 1,
    };
  } else {
    returnObj = {
      totalExecutionTime: queryTime,
      queryCount: 1,
    };
  }

  return returnObj;
}

class Profiler {
  version: string;

  startTime: number;

  config: ProfilerConfig;

  profiles: Profile;

  slowQueryLimit: number;

  constructor(config: ProfilerConfig) {
    this.version = 'MySQL';
    this.startTime = Date.now();
    this.config = { ...defaultProfilerConfig, ...config };
    this.profiles = {
      executionTimes: [],
      resources: {},
      slowQueries: [],
    };
    this.slowQueryLimit = 0;
  }

  get getFastestSlowQuery() {
    return this.profiles.slowQueries.reduce(
      (acc, { queryTime }) => ((queryTime < acc) ? queryTime : acc),
      0,
    );
  }

  addSlowQuery(sql: string, resource: string, queryTime: number) {
    this.profiles.slowQueries.push({ sql, resource, queryTime });
    if (this.profiles.slowQueries.length > this.config.slowestQueries) {
      const min = this.getFastestSlowQuery;
      // no shadow, so no destructuring :(
      this.profiles.slowQueries = this.profiles.slowQueries.filter((sq) => sq.queryTime !== min);
      this.slowQueryLimit = this.getFastestSlowQuery;
    }
  }

  setVersion({ versionPrefix, version }) {
    if (version.startsWith('8.0.') && versionPrefix === 'MySQL') {
      Logger.warning('It is recommended to run MySQL 5 or MariaDB with mysql-async. You may experience performance issues under load by using MySQL 8.');
    }
    this.version = `${versionPrefix}:${version}`;
  }

  fillExecutionTimes(interval: number) {
    for (let i = 0; i < interval; i += 1) {
      if (!this.profiles.executionTimes[i]) {
        this.profiles.executionTimes[i] = {
          totalExecutionTime: 0,
          queryCount: 0,
        };
      }
    }
  }

  profile(time: [number, number], sql: string, resource: string) {
    const interval = Math.floor((Date.now() - this.startTime) / this.config.timeInterval);
    const queryTime = time[0] * 1e3 + time[1] * 1e-6;

    this.profiles.resources[resource] = updateExecutionTimes(
      this.profiles.resources[resource], queryTime,
    );
    this.profiles.executionTimes[interval] = updateExecutionTimes(
      this.profiles.executionTimes[interval], queryTime,
    );
    // fix execution times manually
    this.fillExecutionTimes(interval);
    // todo: cull old intervals

    if (this.slowQueryLimit < queryTime) {
      this.addSlowQuery(sql, resource, queryTime);
    }

    if (this.config.slowQueryWarningTime < queryTime) {
      Logger.warning(`[${resource}] [${queryTime.toFixed()}ms] ${sql}`, { tag: this.version });
    } else {
      Logger.log(`[${resource}] [${queryTime.toFixed()}ms] ${sql}`, { tag: this.version });
    }
  }
}

export default Profiler;
