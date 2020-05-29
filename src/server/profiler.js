const profilerDefaultConfig = {
  trace: false,
  slowQueryWarningTime: 100,
  slowestQueries: 21,
  timeInterval: 300000,
};

function updateExecutionTimes(object, queryTime) {
  let returnObj = null;

  if (object) {
    const { totalExecutionTime, queryCount } = object;

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
  constructor(logger, config) {
    this.version = 'MySQL';
    this.startTime = Date.now();
    this.logger = logger;
    this.config = { ...profilerDefaultConfig, ...config };
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

  addSlowQuery(sql, resource, queryTime) {
    this.profiles.slowQueries.push({ sql, resource, queryTime });
    if (this.profiles.slowQueries.length > this.config.slowestQueries) {
      const min = this.getFastestSlowQuery;
      this.profiles.slowQueries = this.profiles.slowQueries.filter((sq) => sq.queryTime !== min);
      this.slowQueryLimit = this.getFastestSlowQuery;
    }
  }

  setVersion({ versionPrefix, version }) {
    if (version.startsWith('8.0.') && versionPrefix === 'MySQL') {
      this.logger.error('[mysql-async] [Warning] It is recommended to run MySQL 5 or MariaDB with mysql-async. You may experience performance issues under load by using MySQL 8.');
    }
    this.version = `${versionPrefix}:${version}`;
  }

  fillExecutionTimes(interval) {
    for (let i = 0; i < interval; i += 1) {
      if (!this.profiles.executionTimes[i]) {
        this.profiles.executionTimes[i] = {
          totalExecutionTime: 0,
          queryCount: 0,
        };
      }
    }
  }

  profile(time, sql, resource) {
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
      this.logger.error(`[${this.version}] [Slow Query Warning] [${resource}] [${queryTime.toFixed()}ms] ${sql}`);
    }

    if (this.config.trace) {
      this.logger.log(`[${this.version}] [${resource}] [${queryTime.toFixed()}ms] ${sql}`);
    }
  }
}

module.exports = Profiler;
