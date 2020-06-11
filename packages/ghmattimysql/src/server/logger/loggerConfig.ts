import { Color } from "./color";

enum OutputDestination {
  FileAndConsole = <any>'FileAndConsole',
  Console = <any>'Console',
  File = <any>'File',
  None = <any>'None',
}

interface LoggerConfig {
  color?: Color;
  tag?: string;
  level?: string;
  output?: OutputDestination;
}

const defaultLoggerConfig: LoggerConfig = {
  color: Color.Default,
  tag: 'ghmattimysql',
  level: '',
  output: OutputDestination.None,
};

export { LoggerConfig, OutputDestination, defaultLoggerConfig };
