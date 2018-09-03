# ghmattimysql

a mysql middleware for [FiveM](https://fivem.net)

## Install

Move the folder provided in the release section into your `resource` folder of the server application. Add `start ghmattimysql` to the `server.cfg` at the appropriate position, and assign your resources using this resource a `dependency 'ghmattimysql'` in their respective `__resource.lua` files, and edit the `config.json` reasonably for your server.

## Usage

ghmattimysql provides the following functions:

### execute

This is called in lua via `exports.ghmattimysql:execute(query: String, parameters: Object||Array||undefined, callback: function||undefined)` and answers according to whether a select or other sql-command was issued. The select commands answers with an array containing row objects. The other commands will be answered by an object instead containing among others: 
* `info`: an information string from the server. 
* `insertId`: the last insert id.
* `affectedRows`: number of affected rows.
* `changedRows`: number of changed rows.

### scalar

This works exactly the same as execute, it even executes the same logic, but returns but a singular value. The first value of the first row of the select.

### transaction

Transactions are multiple executes chained together, so that if one fails, all others fail too. They can be formated in the following ways. Either an array is passed as the first argument containing objects that are shaped like `{ query: String, parameters: Array||Object }`; here the second parameter would be the callback function which is passed true or false depending on weather the transaction succeeded or not.

Alternatively transactions can be written with 3 parameters: An array of strings, containing the sql commands `[String]`, an object containing parameters and a callback function. The sql commands have to use the `@`-variant in this case.

### sync-variants

Sync variants exist of the three methods above, called `executeSync`, `scalarSync`, and `transactionSync`. Their use is discouraged as they are just a wrapper for the async-methods written in lua.

### parameters

The parameters parameter can be either an object or an array depending on the query the values should be inserted. The two variants look as follows:
* `select * from users where id < ?`: here the parameters will be an array containing the id e.g. `[3]`, the array contents will be inserted in order of occurance.
* `select * from users where id < @id`: here the parameters will be an object containing the id e.g. `{ id: 3 }`.