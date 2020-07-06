---
id: 31
---
## Queries

 All query types in mysql-async can be fired using either *Sync* or *Async* methods, which can be retrieved from the MySQL object. The last parameter of an Async function is always the callback, the argument of the callback gets returned by *Sync* functions.

Contrary to older *Sync* implementations, these functions are safe to use, since they are non-blocking and just wrappers around the *Async* calls. But for a possible migration to other Database implementations, the use of the Sync functions should be discouraged.

### MySQL.ready

You need to encapsulate your code into `MySQL.ready` to be sure that the mod will be available and initialized before your first request. In subsequent examples the `MySQL.ready` function will not be shown, and it is expected that the code is encapsulated.
```lua
MySQL.ready(function ()
  print(MySQL.Sync.fetchScalar('SELECT @parameters', {
    ['@parameters'] =  'string'
  }))
end)
--[[
prints:

string
]]--
```

### execute

Execute a mysql query which should not send any result (like a Insert / Delete / Update), and will return the number of affected rows. 

```lua
MySQL.Async.execute('INSERT INTO users_log (x, y, z, playerId) VALUES (@x, @y, @z, @id)',
  { ['x'] = pos.x, ['y'] = pos.y, ['z'] = pos.z, ['id'] = player.id },
  function(affectedRows)
    print(affectedRows)
  end
)
--[[
prints:

1
]]--
```

### fetchAll

Fetch results from MySQL and returns them in the form of an Array of Objects: 

```lua
MySQL.Async.fetchAll('SELECT * FROM users WHERE id = @id', { ['@id'] = playerId }, function(result)
  print(json.encode(result))
end)
--[[
prints:

[{
  "id": 95585726093402110,
  "cash": 0,
  "bank": 0,
  "skin": "{}",
  "online": true,
  "lastSeen": 1590656804000
}]
]]--
```

### fetchScalar

Fetch the first field of the first row in a query:
```lua
MySQL.Async.fetchScalar('SELECT COUNT(1) FROM users', {}, function(result)
  print(result)
end)
--[[
prints:

15
]]--
```

### insert

Returns the last insert id of the inserted item. Needs an auto-incremented primary key to work. 

```lua
MySQL.Async.insert('INSERT INTO users_log (x, y, z, playerId) VALUES (@x, @y, @z, @id)',
  { ['x'] = pos.x, ['y'] = pos.y, ['z'] = pos.z, ['id'] = player.id },
  function(insertId)
    print(insertId)
  end
)
--[[
prints:

1137
]]--
```

### store

The store export should be used for storing query strings, when a lot of queries are expected to be triggered at once. The idea behind this feature is, that while recieving data puts stress on your server infrastructure, so does sending data. And the biggest polluter for this resource is sending overly long and complicated query strings.

While the server is running you want to minimize the impact of sending a lot of queries at once puts on your architecture, thus you can already store these queries ahead of time, and just pass the id returned by the callback function and pass the parameters for these queries along.

```lua
insertUserLog = -1
MySQL.Async.store("INSERT INTO users_log SET ?", function(storeId) insertUser = storeId end)
-- ...
MySQL.Async.insert(insertUserLog, {
  { ['x'] = pos.x, ['y'] = pos.y, ['z'] = pos.z, ['playerId'] = player.id }
}, function(response)
  print(insertId)
end)
```

This works like the example above, but the query string does not need to be reset and is a bit more elegant in the writing.
