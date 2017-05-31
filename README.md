# MySQL Async Library for FiveM

This library intends to provide function to connect to a MySQL library in a Sync and Async Way.

## Disclaimer

This mod does not replace EssentialMode, it offers instead a new way of connecting to MySQL, but
it will never contain any gameplay logic. It will remain a simple wrapper around MySQL functions.

All feedback is appreciated in order to deliver a stable release.

## Installation

Install the content of this repository in the `resources/mysql-async` folder. **Name of the folder** matters, 
do not use a different name (otherwise you must have knowledge on how this works and make the appropriate changes)

Once installed, you will need to add these lines of code in each mod needing a MySQL client:

```
require "resources/mysql-async/lib/MySQL"
```

## Configuration

Copy the file `resources/mysql-async/lib/config.lua-dist` to `resources/mysql-async/lib/config.lua` and 
change the values according to your MySQL installation.

## Replacing MySQL of EssentialMode

[See the UPGRADING.md documentation](UPGRADING.md)

## Usage

### Sync

> Sync functions can block the main thread, always prefer the Async version if possible, there is very rare 
> use case for you to use this.

#### MySQL.Sync.execute(string query, array params) : int

Execute a mysql query which should not send any result (like a Insert / Delete / Update), and will return the 
number of affected rows.

```lua
MySQL.Sync.execute("UPDATE player SET name=@name WHERE id=@id", {['@id'] = 10, ['@name'] = 'foo'})
```

#### MySQL.Sync.fetchAll(string query, array params) : object[]

Fetch results from MySQL and returns them in the form of an Array of Objects:

```lua
local players = MySQL.Sync.fetchAll('SELECT id, name FROM player')
print(players[1].id)
```

#### MySQL.Sync.fetchScalar(string query, array params) : mixed

Fetch the first field of the first row in a query:

```lua
local countPlayer = MySQL.Sync.fetchScalar("SELECT COUNT(1) FROM players")
```

### Async

#### MySQL.Async.execute(string query, array params, function callback)

Works like `MySQL.Sync.execute` but will return immediatly instead of waiting for the execution of the query.
To exploit the result of an async method you must use a callback function:

```lua
MySQL.Async.execute('SELECT SLEEP(10)', {}, function(rowsChanged)
    print(rowsChanged)
end)
```

#### MySQL.Async.fetchAll(string query, array params, function callback)

Works like `MySQL.Sync.fetchAll` and provide callback like the `MySQL.Async.execute` method:

```lua
MySQL.Async.fetchAll('SELECT * FROM player', {}, function(players)
    print(players[1].name)
end)
```

#### MySQL.Async.fetchScalar(string query, array params, function callback)

Same as before for the fetchScalar method.

```lua
MySQL.Async.fetchScalar("SELECT COUNT(1) FROM players", function(countPlayer)
    print(countPlayer)
end
```


## Difference from Essential Mod MySQL library (before CouchDb)

 * Async
 * It uses the https://github.com/mysql-net/MySqlConnector library instead of the official Connector to support
 real async behavior
 * Create and close a connection for each query, the underlying library use a connection pool so only the 
mysql auth is done each time, old tcp connections are keeped in memory for performance reasons
 * Use NLog for logging, so you can filter and remove logs for the SQL queries in your server
 * The log will also show you the time take by the query, it can be useful to see slow queries. However it is 
recommended to use the official slow query of MySQL in order to do that

## Things that may be added in the future

 * New configuration options for the connection (pool connections, life time, ...) (Make an issue if you need 
a specific configuration)
 * Migration Tool for your Schemas

## Credits

Some parts of this library, and also my understaning were directly inspired by "Essential Mode", thanks to 
them to have begin to work on this, which allows guy like me to not start from scratch every time...
