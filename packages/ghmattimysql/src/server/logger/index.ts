import { appendFileSync, openSync, closeSync } from 'fs';
import { LoggerConfig, OutputDestination, defaultLoggerConfig } from './loggerConfig';
import { Color, colorize } from './color';
import getTimeStamp from './getTimeStamp';
import writeConsole from './writeConsole';

class Logger {
  defaultConfig: LoggerConfig;

  loggingFile: string;

  constructor(outputString: string, defaultOverRides: LoggerConfig) {
    const output = OutputDestination[outputString] || OutputDestination.None;
    this.defaultConfig = { ...defaultLoggerConfig, output, ...defaultOverRides };
    this.loggingFile = null;

    if (this.defaultConfig.output === OutputDestination.File
      || this.defaultConfig.output === OutputDestination.FileAndConsole) {
      this.loggingFile = `./${GetCurrentResourceName()}-${Date.now()}.log`;
      closeSync(openSync(this.loggingFile, 'w'));
    }
  }

  writeFile(msg: string, options: LoggerConfig) {
    if (this.loggingFile !== null) {
      const levelTag = (options.level !== '') ? ` - ${options.level}` : '';
      appendFileSync(this.loggingFile, `${getTimeStamp()}${levelTag}: ${msg}\n`);
    }
  }

  log(msg: string, options: LoggerConfig = {}) {
    const opts = { ...this.defaultConfig, ...options };
    switch (opts.output) {
      default:
      case OutputDestination.Console:
        writeConsole(msg, opts);
        break;
      case OutputDestination.File:
        this.writeFile(msg, opts);
        break;
      case OutputDestination.FileAndConsole:
        writeConsole(msg, opts);
        this.writeFile(msg, opts);
        break;
    }
  }

  error(msg: string, options: LoggerConfig = {}) {
    this.log(msg,
      {
        color: Color.Error,
        output: OutputDestination.FileAndConsole,
        level: 'ERROR',
        ...options,
      });
  }

  info(msg: string, options: LoggerConfig = {}) {
    this.log(msg,
      {
        color: Color.Info,
        output: OutputDestination.FileAndConsole,
        level: 'INFO',
        ...options,
      });
  }

  success(msg: string, options: LoggerConfig = {}) {
    this.log(msg,
      {
        color: Color.Success,
        output: OutputDestination.FileAndConsole,
        level: 'SUCCESS',
        ...options,
      });
  }

  warning(msg: string, options: LoggerConfig = {}) {
    this.log(msg,
      {
        color: Color.Warning,
        output: OutputDestination.FileAndConsole,
        level: 'WARNING',
        ...options,
      });
  }
}

export default Logger;
