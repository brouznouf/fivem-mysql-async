import { createWriteStream, WriteStream } from 'fs';
import OutputDestination from './outputDestination';

class Logger {
  output: OutputDestination;

  fileStream: WriteStream;

  writeConsole: any;

  getTimeStamp: any;

  constructor(output: string) {
    this.output = OutputDestination[output];
    this.fileStream = null;

    if (this.output === 'file' || this.output === 'both') {
      this.fileStream = createWriteStream(`./${GetCurrentResourceName()}.log`);
    }

    this.writeConsole = (msg: string) => console.log(msg);
    this.getTimeStamp = () => {
      const date = new Date();
      return date.toISOString();
    };
  }

  writeFile(msg: string) {
    this.fileStream.write(`${this.getTimeStamp()}: ${msg}\n`);
  }

  log(msg: string) {
    switch (this.output) {
      default:
      case OutputDestination.Console:
        this.writeConsole(msg);
        break;
      case OutputDestination.File:
        this.writeFile(msg);
        break;
      case OutputDestination.FileAndConsole:
        this.writeConsole(msg);
        this.writeFile(msg);
        break;
    }
  }

  error(msg: string) {
    let errorMsg = msg;
    if (this.output !== OutputDestination.File) {
      errorMsg = `\x1b[31m${msg}\x1b[0m`;
    }
    this.log(errorMsg);
  }
}

const logger = new Logger(GetConvar('mysql_debug_output', 'console'));

export default logger;
