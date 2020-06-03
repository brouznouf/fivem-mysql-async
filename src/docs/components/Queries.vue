<template>
  <v-container>
    <h1 class="headline font-weight-medium" id="queries">Queries</h1>
    <p>
      All query types in mysql-async can be fired using either <em>Sync</em> or <em>Async</em> methods, which can be retrieved from the MySQL object.
      The last parameter of an <em>Async</em> function is always the callback, the argument of the callback gets returned by <em>Sync</em> functions.
    </p>
    <p>
      Contrary to older <em>Sync</em> implementations, these functions are safe to use, since they are non-blocking and just wrappers around the <em>Async</em>
      calls. But for a possible migration to other Database implementations, the use of the <em>Sync</em> functions should be discouraged.
    </p>

    <h2 class="title">MySQL.ready</h2>
    <p>
      You need to encapsulate your code into MySQL.ready to be sure that the mod will be available and initialized before your first request.
      In subsequent examples the <code>MySQL.ready</code> function will not be shown, and it is expected that the code is encapsulated.
    </p>
    <pre><code class="language-lua">MySQL.ready(function ()
  print(MySQL.Sync.fetchScalar('SELECT @parameters', {
    ['@parameters'] =  'string'
  }))
end)
--[[
prints:

string
]]--</code></pre>

    <h2 class="title">execute</h2>
    <p>
      Execute a mysql query which should not send any result (like a Insert / Delete / Update), and will return the number of affected rows.
    </p>
    <pre><code class="language-lua">MySQL.Async.execute('INSERT INTO users_log (x, y, z, playerId) VALUES (@x, @y, @z, @id)',
  { ['x'] = pos.x, ['y'] = pos.y, ['z'] = pos.z, ['id'] = player.id },
  function(affectedRows)
    print(affectedRows)
  end
)
--[[
prints:

1
]]--</code></pre>

    <h2 class="title">fetchAll</h2>
    <p>
      Fetch results from MySQL and returns them in the form of an Array of Objects:
    </p>
    <pre><code class="language-lua">MySQL.Async.fetchAll('SELECT * FROM users WHERE id = @id', { ['@id'] = playerId }, function(result)
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
]]--</code></pre>

    <h2 class="title">fetchScalar</h2>
    <p>
      Fetch the first field of the first row in a query:
    </p>
    <pre><code class="language-lua">MySQL.Async.fetchScalar('SELECT COUNT(1) FROM users', {}, function(result)
  print(result)
end)
--[[
prints:

15
]]--</code></pre>

<h2 class="title">insert</h2>
    <p>
      Returns the last insert id of the inserted item. Needs an auto-incremented primary key to work.
    </p>
    <pre><code class="language-lua">MySQL.Async.insert('INSERT INTO users_log (x, y, z, playerId) VALUES (@x, @y, @z, @id)',
  { ['x'] = pos.x, ['y'] = pos.y, ['z'] = pos.z, ['id'] = player.id },
  function(insertId)
    print(insertId)
  end
)
--[[
prints:

1137
]]--</code></pre>
  </v-container>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.language-lua {
  width: 100%;
}
</style>
