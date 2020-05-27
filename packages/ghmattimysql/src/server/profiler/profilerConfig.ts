interface ProfilerConfig {
  trace?: boolean;
  slowQueryWarningTime?: number;
  slowestQueries?: number;
  timeInterval?: number;
}

const defaultProfilerConfig: ProfilerConfig = {
  trace: false,
  slowQueryWarningTime: 100,
  slowestQueries: 21,
  timeInterval: 300000,
};

export { ProfilerConfig, defaultProfilerConfig };
