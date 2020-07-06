---
id: 41
---

## Transactions
      
 A transaction will only commit all queries to the database, if all queries to the database succeed. If one of them fails, no changes to the database will be made. This can be easily used when e.g. transfering money, making sure that the money field is positive. A transaction would fail if someone would attempt to have negative cash, so that no money would be transfered.

Since the transaction will either fail or succeed, the callback of the function will either answer with true or false depending on if the transaction succeeded. If it fails an error message will be printed, but it is an intended one, since the commit to the database would be likely unwanted.

The following example shows the same transaction being done twice in different ways. 

```lua
MySQL.Async.transaction({
    'UPDATE users SET cash = cash - @transfer WHERE id = @senderId',
    'UPDATE users SET cash = cash + @transfer WHERE id = @recipientId'
  },
  { ['transfer'] = amount, ['senderId'] = senderId, ['recipientId'] = recipientId },
  function(success)
    print(success)
  end
)
--[[
prints:

true or false, depending on if cash goes negative or not.
]]--
```

```lua
MySQL.Async.transaction({
    {
      query = 'UPDATE users SET cash = cash - @transfer WHERE id = @senderId',
      parameters = { ['transfer'] = amount, ['senderId'] = senderId },
    },
    {
      query = 'UPDATE users SET cash = cash + @transfer WHERE id = @recipientId',
      parameters = { ['transfer'] = amount, ['recipientId'] = recipientId },
    },
  },
  function(success)
    print(success)
  end
)
--[[
prints:

true or false, depending on if cash goes negative or not.
]]--
```