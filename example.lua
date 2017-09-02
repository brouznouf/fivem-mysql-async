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

MySQL.ready(function ()
    print(MySQL.fetchScalar('SELECT @parameters', {
        ['@parameters'] =  1
    }))

    print(MySQL.fetchAll('SELECT "hello1" as world', {})[1].world)

    MySQL.execute('SELECT SLEEP(5)', nil)

    MySQL.fetchScalar('WRONG SQL QUERY', {})
end)

--Citizen.CreateThread(function ()
--    Citizen.CreateThreadNow(function()
--        while true do
--            print('Ugh')
--            Citizen.Wait(100)
--        end
--    end)
--
--    while true do
--        print("YOLO")
--        Citizen.Wait(50)
--    end
--end)
