import { colorize } from './color';
import { LoggerConfig } from './loggerConfig';

function writeConsole(msg: string, options: LoggerConfig) {
  const levelTag = (options.level !== '') ? ` [${options.level}]` : '';
  const tag = colorize(`[${options.tag}]${levelTag}`, options.color);
  console.log(`${tag} ${msg}`);
}

export default writeConsole;
