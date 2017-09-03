--executed = 0
--received = 0
--
--local function Loop()
--    SetTimeout(2, function ()
----        MySQL.Sync.fetchAll('WRONG SQL QUERY', {})
--
--        MySQL.Sync.fetchScalar('SELECT @parameters', {
--            ['@parameters'] =  'string'
--        })
--
--        executed = executed + 1
--
--        MySQL.Async.fetchAll('SELECT "hello2" as world', {}, function(result)
--            received = received + 1
--        end)
--
--        if executed % 100 == 0 then
--            print(received .. "/"  .. executed)
--        end
--
--        Loop()
--    end)
--end
--
--AddEventHandler('onMySQLReady', function ()
--    Loop()
--end)

--- New api
MySQL.ready(function ()
    print(MySQL.fetchScalar('SELECT @parameters', {
        ['@parameters'] =  1
    }))

    print(MySQL.fetchScalar('SELECT @parameters', {
        ['@parameters'] =  'string'
    }))

    print(MySQL.fetchScalar('SELECT NOW() as world'))

    MySQL.execute('SELECT SLEEP(2)')

    print(MySQL.fetchAll('SELECT "hello1" as world', {})[1].world)

    print(MySQL.fetchScalar('SELECT "hello3" as world', {}))

    print(json.encode(MySQL.fetchScalar('SELECT null', {})))

    print(json.encode(Citizen.Await(promise.all({
        MySQL.Async.execute('SELECT SLEEP(1)'),
        MySQL.Async.fetchScalar('SELECT "test"'),
    }))))

    MySQL.fetchAll('WRONG SQL QUERY', {})
end)

--- Old api
--MySQL.ready(function ()
--    print(MySQL.Sync.fetchScalar('SELECT @parameters', {
--        ['@parameters'] =  1
--    }))
--
--    print(MySQL.Sync.fetchScalar('SELECT @parameters', {
--        ['@parameters'] =  'string'
--    }))
--
--    MySQL.Async.fetchScalar('SELECT NOW() as world', {}, function(result)
--        print(result)
--    end)
--
--    MySQL.Async.execute('SELECT SLEEP(5)', nil, function()
--        print("1")
--    end)
--    MySQL.Async.execute('SELECT SLEEP(4)', nil, function()
--        print("2")
--    end)
--    MySQL.Async.execute('SELECT SLEEP(3)', {}, function()
--        print("3")
--    end)
--    MySQL.Async.execute('SELECT SLEEP(2)', nil, function()
--        print("4")
--    end)
--    MySQL.Async.execute('SELECT SLEEP(1)', nil, function()
--        print("5")
--    end)
--
--    print(MySQL.Sync.fetchAll('SELECT "hello1" as world', {})[1].world)
--
--    MySQL.Async.fetchAll('SELECT "hello2" as world', {}, function(result)
--        print(result[1].world)
--    end)
--
--    print(MySQL.Sync.fetchScalar('SELECT "hello3" as world', {}))
--
--    MySQL.Async.fetchScalar('SELECT "hello4" as world', {}, function(result)
--        print(result)
--    end)
--
--    print(json.encode(MySQL.Sync.fetchScalar('SELECT null', {})))
--
--    MySQL.Async.fetchScalar('SELECT null', {}, function(result)
--        print(result)
--    end)
--
--    MySQL.Sync.fetchAll('WRONG SQL QUERY', {})
--end)
