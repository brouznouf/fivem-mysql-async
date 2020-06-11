enum Color {
  Default = '\x1b[0m',
  Error = '\x1b[31m',
  Success = '\x1b[32m',
  Warning = '\x1b[33m',
  Info = '\x1b[36m',
}

function colorize(string: string, color: Color): string {
  return `${color}${string}${Color.Default}`;
}

export {
  Color,
  colorize,
};
