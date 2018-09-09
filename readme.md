# ghmattimysql

A mysql middleware for [FiveM](https://fivem.net)

## Table of Contents

* [Install](#install)
  * [Configuration via `config.json`](#configuration-via-configjson)
  * [Configuration via `mysql_connection_string`](#configuration-via-mysql_connection_string)
  * [Additional Configuration Options](#additional-configuration-options)
* [API](#api)
  * [execute](#execute)
  * [scalar](#scalar)
  * [transaction](#transaction)
  * [Synchronous Methods](#synchronous-methods)
* [Examples](#examples)

## Install

Download the latest version of ghmattimysql from the [release](https://github.com/GHMatti/ghmattimysql/releases/latest) section of the repository. Pick the file named `ghmattimysql-<version>.zip`. Extract the contents into your `/resources/` folder of the FiveM server, and then configure the resource to make it connect to your *MySQL* / *MariaDB* server.

### Configuration via `config.json`

Browse to `/resources/ghmattimysql/` and open the `config.json` file. This shows a variety of recommended options, with which you can configure your databse connection with. Additional options can be added, or options can be removed if it suits your server better. A list of all connection options can be found in the [mysql.js readme](https://github.com/mysqljs/mysql#connection-options), furthermore a list of all options to configure the pool behaviour can be also found in the [mysql.js readme](https://github.com/mysqljs/mysql#pool-options).

### Configuration via `mysql_connection_string`

For this to work you need to delete the `config.json` file in your `/resources/ghmattimysql/` folder. Then the `server.cfg` needs to be modified by adding `set mysql_connection_string "mysql://mysqluser:password@localhost/database?dateStrings=true"` before the `start ghmattimysql` line. As an example it can look like this:

```
set mysql_connection_string "mysql://mysqluser:password@localhost/database?dateStrings=true"
start ghmattimysql
```

### Additional Configuration Options
The following additional options are available in the `server.cfg` which you execute. These have also to be set before `start ghmattimysql`
* `set mysql_debug 1`: Prints out the actual consumed query.
* `set mysql_use_boolean 1`: Converts the results of `TINYINT(1)` into true / false. This option is recommended for running lua scripts, as `if (0)` returns true.

## API

This resource is solely exposed via exports. For the scripting languages C# and Lua, you can use both synchronous and asynchronous, for javascript you can only use asynchronous methods. For the execute export you call in e.g. lua
```lua
exports.ghmattimysql:execute(parameters)
```
with the relevant parameters. Henceforth we will drop the `exports.ghmattimysql:` part and will refer to just the export name.

Why do we prefer exports instead of the `lib/MySQL.lua`? The answer is simple, `mysql-async` only works for lua, while *ghmattimysql* works for any language you want to script with.

### execute

This is the universal function which will handle most of your requests. The syntax is
```js
execute(query: String, parameters: Object | Array | undefined, callback: function | undefined)
```
You can leave parameters out if you so desire and use the second argument as a callback function. For a select statement `execute` will answer with an array containing the rows of the statement. For anything else, meaning `INSERT`, `UPDATE`, `DELETE`, etc. the response will look like this.
```js
{ fieldCount: 0,
  affectedRows: 1,
  insertId: 0,
  info: 'Rows matched: 1  Changed: 0  Warnings: 0',
  serverStatus: 2,
  warningStatus: 0,
  changedRows: 0 }
  ```
  Theses results are passed to the callback function as its first and only parameter.

### scalar

You use this function when you want only a singular value returned. This means you can call it when when selecting exactly one row and one column.
```js
scalar(query: String, parameters: Object | Array | undefined, callback: function | undefined)
```
It works internally the same as execute, and if this fails, so does execute. It just extracts the first column of the first response row.

### transaction

Transactions are multiple executes chained together, so that if one fails, all others fail too. They can be formated in the following ways. Either an array is passed as the first argument containing objects that are shaped like `{ query: String, parameters: Array | Object }`; here the second parameter would be the callback function which is passed true or false depending on weather the transaction succeeded or not.

Alternatively transactions can be written with 3 parameters: An array of strings, containing the sql commands `[String]`, an object containing parameters and a callback function. The sql commands have to use the `@`-variant in this case.

### Synchronous Methods

Sync variants exist of the three methods above, called `executeSync`, `scalarSync`, and `transactionSync`. Their use is discouraged as they are just a wrapper for the async-methods written in lua.

## Examples

### parameters

The parameters parameter can be either an object or an array depending on the query the values should be inserted. The two variants look as follows:
* `select * from users where id < ?`: here the parameters will be an array containing the id e.g. `[3]`, the array contents will be inserted in order of occurance.
* `select * from users where id < @id`: here the parameters will be an object containing the id e.g. `{ id: 3 }`.
