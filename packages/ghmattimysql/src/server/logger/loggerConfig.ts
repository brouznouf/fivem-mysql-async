import { Color } from "./color";

enum OutputDestination {
  FileAndConsole = <any>'both',
  Console = <any>'console',
  File = <any>'file',
  None = <any>'none',
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
