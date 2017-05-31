# Upgrading from Essential Mode

As said in the README, this library does not fully replace Essential Mode, it can only replace the MySQL part 
associated with.

## First and quick upgrade

Instead of upgrading all your mods one by one, this library offers a lua script which 
provides the same MySQL functions from version 2 of Essential Mode and earlier.

You just need to replace **all** contents of the `resources/essentialmode/lib/MySQL.lua` file by the following code:

```
require "resources/mysql-async/lib/MySQL"
require "resources/mysql-async/lib/EssentialModeApi"
```

Then all old code should work like before.

However you will potentialy have the same problems as before: locking the main thread with a bad query.

## Upgrade to the Async API

Now that you have 

### Queries returning a result (Select / ...)

Let's say you have the following code:

```
local executed_query = MySQL:executeQuery("SELECT * FROM users WHERE identifier = '@name'", {['@name'] = 
identifier})
local result = MySQL:getResults(executed_query, {'money'}, 
"identifier")

TriggerClientEvent("my_event", self.source, result[1].money)
```

You can replace it with the following code:

```
MySQL.Async.fetchAll("SELECT * FROM users WHERE identifier = @name", {['@name'] = identifier}, function (result)
    TriggerClientEvent("my_event", self.source, result[1].money)
end
```

First we use the new method `MySQL.Async.fetchAll` which intends to retrieve results from a query, it use the 
same API as before for the first two parameters. However it provides a third parameters which is a callback 
(a function).

This API is mandatory when dealing with async, as you don't know when the result will be available, that's 
why you provide a callback that will be called once the result is ready to exploit.

Also there is no more need of having 2 calls to the API.

There is one little change you may have not seen on the query on the `@name` parameter: it does not require 
quote anymore. Parameter replacing is done with the underlying library which guard you from SQL injection. 
However, be warned, you can still have SQL injection if you poorly construct your query (like using 
concatenation with a value coming from the user), but if you stick with paramters you should be good.

A last optimisation can be done here, if you read well the example we only care about the money for a given 
user (so only one value). This library provide the `MySQL.Async.fetchScalar` method to handle this use case 
which will return only the value of the first column in the first line, so you can safely write this instead:

```
MySQL.Async.fetchAll("SELECT money FROM users WHERE identifier = @name", {['@name'] = identifier}, function (money)
    TriggerClientEvent("my_event", self.source, money)
end
```

However the query has to bee updated in order to select only the money, otherwise it will return the first 
value of the column in your schema.

### Queries no returning a result (Update / Insert / Delete / ...)

For query no returning any result like this code:

```
MySQL:executeQuery("UPDATE users SET `money`='@value' WHERE identifier = '@identifier'", {
    ['@value'] = 300,
    ['@identifier'] = 'steam...'
})
```

you can replace it with

```
MySQL.Async.execute("UPDATE users SET `money`=@value WHERE identifier = @identifier", {
    ['@value'] = 300,
    ['@identifier'] = 'steam...'
})
```

Like before the quote around parameters are no more required, and in fact you should remove them or it will 
fail.

Like `fetchAll` this method propose also a callback parameter in the third position which can be used if you 
want to do something once this query has been executed:

```
MySQL.Async.execute("UPDATE users SET `money`=@value WHERE identifier = @identifier", {
    ['@value'] = 300,
    ['@identifier'] = 'steam...'
}, function (rowsUpdate)
    print('Query executed')
end
```

### Debugging

To help upgrading, each call to the old API will trigger a debug log in your server, to read them you will 
have to change the configuration of the `NLog.config` file at the root of your fivem server, in order to have 
theses lines:

```
<rules>
  <logger name="*" minlevel="Debug" writeTo="console"/>
</rules>
```

### Cleaning

Once all queries have been replaced you can safely remove this line:

```
require "resources/mysql-async/lib/EssentialModeApi"
```

since the old API is not required anymore.
