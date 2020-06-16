---
id: 31
---
## Queries

To run any kind of queries, you can access the exports of the resource, e.g. in JavaScript via `exports.ghmattimysql`.
To learn more about accessing exports please refer to your respective scripting runtime in the
[FiveM Documentation](https://docs.fivem.net/docs/scripting-manual/runtimes/). Hereafter this documentation
will only refer to the exported function names.

The universal function is execute. It will handle almost all of your requests, apart from transactions. The `Sync`-variants are
just sync wrappers for the normal async calls and should not impact code performance, but can only be accessed with `Lua` or
`C#`.
```typescript
execute(query: string, parameters?: object | array, callback?: function): void
execute(query: string, callback?: function): void
executeSync(query: string, parameters?: object | array): result
```

Example of selecting a row with the old / C# syntax in `Lua`. Note that the `@`
in the `parameters` argument is not needed, and you could just go with `id` as seen in the
transaction examples.

```lua
local playerId = getPlayerId()
exports.ghmattimysql:execute("SELECT * FROM users WHERE id = @id", { ['@id'] = playerId }, function(result)
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

Example of inserting a row with the mysql.js syntax in `JavaScript`. Note that insertId is only not 0, if
the insert happens into a table with an autoincremented id.

```js
const { x, y, z } = getPlayerCoordinates(playerId);
exports.ghmattimysql.execute("INSERT INTO users_log (x, y, z, playerId) VALUES (?, ?, ?, ?)",
  [ x, y, z, playerId ], (result) => { 
    console.log(JSON.stringify(result));
  }
);
/*
prints:

{
  "fieldCount": 0,
  "affectedRows": 1,
  "insertId": 0,
  "serverStatus": 2,
  "warningCount: 0,
  "message": "",
  "protocol41": true,
  "changedRows": 0
}
*/
```

Example of inserting multiple rows with the mysql.js syntax in `JavaScript`.

```js
const rows = players.map((player) => {
  const { x, y, z } = getPlayerCoordinates(player.id);
  return [x, y, z, player.id];
});
exports.ghmattimysql.execute("INSERT INTO users_log (x, y, z, playerId) VALUES ?", [rows], (result) => { 
  console.log(JSON.stringify(result));
});
/*
prints:

{
  "fieldCount": 0,
  "affectedRows": 1,
  "insertId": 0,
  "serverStatus": 2,
  "warningCount: 0,
  "message": "",
  "protocol41": true,
  "changedRows": 0
}
*/
```

Example of updating a row with the mysql.js syntax.
```lua
local values = { "users", "online", true, { ["id"] = getPlayerId() } }
exports.ghmattimysql:execute("UPDATE ?? SET ?? = ? WHERE ?", values,
  function(result)
    print(json.encode(result))
  end
)
--[[
prints:

{
  "fieldCount": 0,
  "affectedRows": 1,
  "insertId": 0,
  "serverStatus": 2,
  "warningCount: 0,
  "message": "(Rows matched: 1 Changed: 1 Warnings: 0)",
  "protocol41": true,
  "changedRows": 1
}
]]--
```
