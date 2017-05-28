require "resources/mysql-async/lib/MySQL"

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

MySQL.Async.fetchAll('SELECT "hello5" as world', '', function(result)
    print(result[1].world)
end, transaction)

MySQL.Async.commitTransaction(transaction, function()
    print('transaction commited')
end)

local transaction = MySQL.Sync.beginTransaction();

MySQL.Async.rollbackTransaction(transaction, function()
    print('transaction rollbacked')
end)

local transaction = MySQL.Sync.beginTransaction();
MySQL.Sync.commitTransaction(transaction)

local transaction = MySQL.Sync.beginTransaction();
MySQL.Sync.rollbackTransaction(transaction)
