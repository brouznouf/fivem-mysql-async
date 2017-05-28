# MySql Async Library for FiveM

This library intends to provide function to connect to a MySql library in a Sync and Async Way.

## Disclaimer

This library is still in alpha and has not been fully tested on heavy load that can occurs on some servers, 
all feedback is appreciated in order to deliver a stable release.

This mod does not replace EssentialMode, it offers instead a new way of connecting to mysql, but
it will never contain any gameplay logic or opiniated vision. It will remain a simple wrapper around MySQL 
Functions.

## Installation

Install the content of this repository in the `resources/mysql-async` folder. **Name of the folder** matters, 
do not use a different name (otherwiser you must have knowledge on how this works and make the apprioriate 
changes)

Once installed, you will need to add these lines of code in your mod in order to profit from the MySQL 
Library:

```
require "resources/mysql-async/lib/MySQL"
```

## Configuration

Copy the file `resources/mysql-async/lib/config.lua-dist` to `resources/mysql-async/lib/config.lua` and 
change the values according to your mysql installation.

## Replacing MySQL of EssentialMode

[See the UPGRADING.md documentation](UPGRADING.md)

## Usage

### Sync

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

### MySQL.Sync.fetchScalar(string query, array params) : mixed

Fetch the first field of the first row in a query:

```lua
local countPlayer = MySQL.Sync.fetchScalar("SELECT COuNT(1) FROM players")
```

### Async

#### MySQL.Async.execute(string query, array params, function callback) : coroutine

Works like `MySQL.Sync.execute` but will return immediatly instead of waiting for the execution of the query.
There is 2 way to retrieve the result.

You can use a callback function:

```lua
MySQL.Async.execute('SELECT SLEEP(10)', {}, function(rowsChanged)
    print(rowsChanged)
end)
```

Or you can use a coroutine:

```lua
cor = MySQL.Async.execute('SELECT SLEEP(10)')

-- do some works here

-- Block until query execution
list status, rowsChanged = cor.resume()
print(rowsChanged)
```

#### MySQL.Async.fetchAll(string query, array params, function callback) : coroutine

Works like `MySQL.Sync.fetchAll` and provide callback and coroutine like the `MySQL.Async.execute` method:

```lua
cor = MySQL.Async.fetchAll('SELECT * FROM player', {}, function(players)
    print(players[1].name)
end)

list status, players = cor.resume()

print(players[1].name)
```

### MySQL.Async.fetchScalar(string query, array params, function callback) : coroutine

Same as before for the fetchScalar method.

## Difference from Essential Mod (before CouchDb)

 * Each query will attempt to use an existing connection if available or create a new one if not available
 (a query is still running). It uses the internal Pool of the Mysql Connector in order to achieve that.
 * It uses the https://github.com/mysql-net/MySqlConnector library instead of the official Connector to support
 real async behavior.

## Things that may be added in the future

 * New configuration options for the connection (max connections, ...)
 * Regulary clean the connection pool (in order to avoid have too many "dead" connection)
 * New API Methods to reduce code base for common use case (like fetching a single scalar / row)
 * Transaction supports

## Credits

Some parts of this library, and also my understaning were directly inspired by "Essential Mode", thanks to 
them to have begin to work on this, which allows guy like me to not start from scratch every time...
