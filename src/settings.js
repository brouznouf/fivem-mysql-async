const { parseUrl } = require('mysql/lib/ConnectionConfig');

// add some more functionality and improve the C# connection string parsing
function parseConnectingString(connectionString) {
  let cfg = null;
  if (/(?:database|initial\scatalog)=(?:(.*?);|(.*))/gi.test(connectionString)) {
    let matches = (/(?:host|server|data\s?source|addr(?:ess)?)=(?:(.*?);|(.*))/gi.exec(connectionString));
    const host = (matches) ? matches[1] || matches[2] : 'localhost';
    matches = (/(?:Port)=(?:(.*?);|(.*))/gi.exec(connectionString));
    const port = (matches) ? matches[1] || matches[2] : 3306;
    matches = (/(?:user\s?(?:id|name)?|uid)=(?:(.*?);|(.*))/gi.exec(connectionString));
    const user = (matches) ? matches[1] || matches[2] : 'root';
    matches = (/(?:password|pwd)=(?:(.*?);|(.*))/gi.exec(connectionString));
    const password = (matches) ? matches[1] || matches[2] : '';
    matches = (/(?:database|initial\scatalog)=(?:(.*?);|(.*))/gi.exec(connectionString));
    const database = (matches) ? matches[1] || matches[2] : '';
    cfg = {
      host,
      port,
      user,
      password,
      database,
      supportBigNumbers: true,
      multipleStatements: true,
    };
  } else if (/mysql:\/\//gi.test(connectionString)) {
    cfg = parseUrl(connectionString);
  } else throw new Error('No valid connection string found');

  return cfg;
}

module.exports = parseConnectingString;
