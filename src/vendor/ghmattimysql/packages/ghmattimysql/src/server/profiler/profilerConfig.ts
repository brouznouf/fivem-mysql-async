interface ProfilerConfig {
  slowQueryWarningTime?: number;
  slowestQueries?: number;
  timeInterval?: number;
}

const defaultProfilerConfig: ProfilerConfig = {
  slowQueryWarningTime: 100,
  slowestQueries: 21,
  timeInterval: 300000,
};

export { ProfilerConfig, defaultProfilerConfig };
