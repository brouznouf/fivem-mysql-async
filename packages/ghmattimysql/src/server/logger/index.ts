import { createWriteStream, WriteStream } from 'fs';
import { LoggerConfig, OutputDestination, defaultLoggerConfig } from './loggerConfig';
import { Color, colorize } from './color';

class Logger {
  defaultConfig: LoggerConfig;

  fileStream: WriteStream;

  constructor(outputString: string) {
    const output = OutputDestination[outputString] || OutputDestination.None;
    this.defaultConfig = { ...defaultLoggerConfig, output };
    this.fileStream = null;

    if (this.defaultConfig.output === OutputDestination.File || this.defaultConfig.output === OutputDestination.FileAndConsole) {
      this.fileStream = createWriteStream(`./ghmattimysql-${this.getTimeStamp()}.log`);
    }
  }

  getTimeStamp() {
    const date = new Date();
    return date.toISOString();
  }

  writeConsole(msg: string, options: LoggerConfig) {
    const tag = colorize(`[${options.tag}]`, options.color);
    const levelTag = (options.level !== '') ? ` [${options.level}]` : '';
    console.log(`${tag}${levelTag} ${msg}`);
  }

  writeFile(msg: string, options: LoggerConfig) {
    if (this.fileStream !== null) {
      const levelTag = (options.level !== '') ? ` - ${options.level}` : '';
      this.fileStream.write(`${this.getTimeStamp()}${levelTag}: ${msg}\n`);
    }
  }

  log(msg: string, options: LoggerConfig = {}) {
    const opts = { ...this.defaultConfig, ...options };
    switch (opts.output) {
      default:
      case OutputDestination.Console:
        this.writeConsole(msg, opts);
        break;
      case OutputDestination.File:
        this.writeFile(msg, opts);
        break;
      case OutputDestination.FileAndConsole:
        this.writeConsole(msg, opts);
        this.writeFile(msg, opts);
        break;
    }
  }

  error(msg: string, options: LoggerConfig = {}) {
    this.log(msg, { color: Color.Error, output: OutputDestination.FileAndConsole, level: 'ERROR', ...options });
  }

  info(msg: string, options: LoggerConfig = {}) {
    this.log(msg, { color: Color.Info, output: OutputDestination.FileAndConsole, level: 'INFO', ...options });
  }

  success(msg: string, options: LoggerConfig = {}) {
    this.log(msg, { color: Color.Success, output: OutputDestination.FileAndConsole, level: 'SUCCESS', ...options });
  }

  warning(msg: string, options: LoggerConfig = {}) {
    this.log(msg, { color: Color.Warning, output: OutputDestination.FileAndConsole, level: 'WARNING', ...options });
  }
}

const logger = new Logger(GetConvar('mysql_debug', 'none'));

export default logger;
