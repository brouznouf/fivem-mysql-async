const fs = require('fs');

function writeConsole(msg) {
  console.log(msg);
}

class Logger {
  constructor(output) {
    this.output = output;
    this.fileStream = null;
    if (this.output === 'file' || this.output === 'both') {
      this.fileStream = fs.createWriteStream('./mysql-async.log');
    }
    this.writeConsole = writeConsole;
  }

  writeFile(msg) {
    this.fileStream.write(`${msg}\n`);
  }

  log(msg) {
    switch (this.output) {
      default:
      case 'console':
        this.writeConsole(msg);
        break;
      case 'file':
        this.writeFile(msg);
        break;
      case 'both':
        this.writeConsole(msg);
        this.writeFile(msg);
        break;
    }
  }

  error(msg) {
    let errorMsg = msg;
    if (this.output === 'console') {
      errorMsg = `\x1b[31m${msg}\x1b[0m`;
    }
    this.log(errorMsg);
  }
}

module.exports = Logger;
