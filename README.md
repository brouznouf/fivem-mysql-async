# MySql Async Library for FiveM

This library intends to provide function to connect to a MySql library in a Sync and Async Way.

## Disclaimer

This library is still in alpha and has not been fully tested on heavy load that can occurs on some servers, 
all feedback is appreciated in order to deliver a stable release.

## Installation

Install the content of this repository in the `resources/mysql-async` folder. **Name of the folder** matters, 
do not use a different name (otherwiser you must have knowledge on how this works and make the apprioriate 
changes)

Once installed, you can change the `resources/mysql-async/init.lua` to set the correct configuration of your 
mysql server and add this mod to your FiveM configuration file:

```yml
AutoStartResources:
    - mysql-async
```

Loading this library in first is higly recommanded so you don't have dependencies problem when using MySql.

## Usage

### Sync

#### MySQL:execute(string query, array params) : int

Execute a mysql query which should not send any result (like a Insert / Delete / Update), and will return the 
number of affected rows.

```lua
MySQL:execute("UPDATE player SET name='foo' WHERE id='@id'", {['@id'] = 10})
```

#### MySQL:fetchAll(string query, array params) : object[]

Fetch results from MySQL and returns them in the form of an Array of Objects:

```lua
local players = MySQL:fetchAll('SELECT id, name FROM player')
print(players[1].id)
```

### Async

#### MySQL:executeAsync(string query, array params, function callback) : coroutine

Works like `MySQL:execute` but will return immediatly instead of waiting for the execution of the query.
There is 2 way to retrieve the result.

You can use a callback function:

```lua
MySQL:executeAsync('SELECT SLEEP(10)', {}, function(rowsChanged)
    print(rowsChanged)
end)
```

Or you can use a coroutine:

```lua
cor = MySQL:executeAsync('SELECT SLEEP(10)')

-- do some works here

-- Block until query execution
list status, rowsChanged = cor.resume()
print(rowsChanged)
```

#### MySQL:fetchAllAsync(string query, array params, function callback) : coroutine

Works like `MySQL:fetchAll` and provide callback and coroutine like the `MySQL:executeAsync` method:

```lua
cor = MySQL:fetchAllAsync('SELECT * FROM player', {}, function(players)
    print(players[1].name)
end)

list status, players = cor.resume()

print(players[1].name)
```

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

