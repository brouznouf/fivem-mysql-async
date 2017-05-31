require "resources/mysql-async/lib/MySQL"

print(MySQL.Sync.fetchScalar('SELECT @parameters', {
    ['@parameters'] =  1
}))

print(MySQL.Sync.fetchScalar('SELECT @parameters', {
    ['@parameters'] =  'string'
}))

MySQL.Async.execute('SELECT SLEEP(5)', '', function()
    print("1")
end)
MySQL.Async.execute('SELECT SLEEP(4)', '', function()
    print("2")
end)
MySQL.Async.execute('SELECT SLEEP(3)', '', function()
    print("3")
end)
MySQL.Async.execute('SELECT SLEEP(2)', '', function()
    print("4")
end)
MySQL.Async.execute('SELECT SLEEP(1)', '', function()
    print("5")
end)

print(MySQL.Sync.fetchAll('SELECT "hello1" as world', '')[1].world)

MySQL.Async.fetchAll('SELECT "hello2" as world', '', function(result)
    print(result[1].world)
end)

print(MySQL.Sync.fetchScalar('SELECT "hello3" as world', ''))

MySQL.Async.fetchScalar('SELECT "hello4" as world', '', function(result)
   print(result)
end)

MySQL.Sync.fetchAll('WRONG SQL QUERY', '')

local transaction = MySQL.Sync.beginTransaction();

MySQL.Async.fetchAll('SELECT SLEEP(2), "hello5" as world', '', function(result)
    print(result[1].world)

    MySQL.Async.commitTransaction(transaction, function()
        print('transaction commited')
    end)
end, transaction)


local transaction2 = MySQL.Sync.beginTransaction();

MySQL.Async.rollbackTransaction(transaction2, function()
    print('transaction rollbacked')
end)

local transaction3 = MySQL.Sync.beginTransaction();
MySQL.Sync.commitTransaction(transaction3)

local transaction4 = MySQL.Sync.beginTransaction();
MySQL.Sync.rollbackTransaction(transaction4)
