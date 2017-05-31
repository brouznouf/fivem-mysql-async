
---
-- Execute a query with no result required
--
-- @param query
-- @param params
-- @param func
-- @param Transaction transaction
--
-- @return coroutine
--
function MySQL.Async.execute(query, params, func, transaction)
    local Command = MySQL.Utils.CreateCommand(query, params, transaction)
    local executeTask = Command.ExecuteNonQueryAsync();
    local callback = func or function() end
    local connection

    if transaction then
        connection = nil
    else
        connection = Command.connection
    end

    clr.Brouznouf.FiveM.Async.ExecuteCallback(executeTask, MySQL.Async.wrapQuery(
        callback,
        connection,
        Command.CommandText
    ))
end

---
-- Execute a query and fetch all results in an async way
--
-- @param query
-- @param params
-- @param func
-- @param Transaction transaction
--
-- @return coroutine
--
function MySQL.Async.fetchAll(query, params, func, transaction)
    local Command = MySQL.Utils.CreateCommand(query, params, transaction)
    local executeReaderTask = Command.ExecuteReaderAsync();
    local callback = func or function(Result) return Result end
    local connection

    if transaction then
        connection = nil
    else
        connection = Command.connection
    end

    clr.Brouznouf.FiveM.Async.ExecuteReaderCallback(executeReaderTask, MySQL.Async.wrapQuery(
        function (Result)
            callback(MySQL.Utils.ConvertResultToTable(Result))
        end,
        connection,
        Command.CommandText
    ))
end

---
-- Execute a query and fetch the first column of the first row
-- Useful for count function by example
--
-- @param query
-- @param params
-- @param func
-- @param Transaction transaction
--
-- @return coroutine
--
function MySQL.Async.fetchScalar(query, params, func, transaction)
    local Command = MySQL.Utils.CreateCommand(query, params, transaction)
    local executeScalarTask = Command.ExecuteScalarAsync();
    local callback = func or function() end
    local connection

    if transaction then
        connection = nil
    else
        connection = Command.connection
    end

    clr.Brouznouf.FiveM.Async.ExecuteScalarCallback(executeScalarTask, MySQL.Async.wrapQuery(
        callback,
        connection,
        Command.CommandText
    ))
end

---
-- Create a transaction
--
-- @param function func
--
-- @return coroutine
--
function MySQL.Async.beginTransaction(func)
    local connection = MySQL:createConnection();
    local beginTransactionTask = connection.BeginTransactionAsync(clr.System.Threading.CancellationToken.None);
    local callback = func or function() end

    clr.Brouznouf.FiveM.Async.BeginTransactionCallback(beginTransactionTask, MySQL.Async.wrapQuery(
        callback,
        nil,
        'BEGIN TRANSACTION'
    ))
end

---
-- Commit the transaction
--
-- @param Transaction transaction
-- @param function func
--
function MySQL.Async.commitTransaction(transaction, func)
    local commitTransactionTrask = transaction.CommitAsync(clr.System.Threading.CancellationToken.None);
    local callback = func or function() end

    clr.Brouznouf.FiveM.Async.CommitTransactionCallback(commitTransactionTrask, MySQL.Async.wrapQuery(
        callback,
        transaction.Connection,
        'COMMIT'
    ))
end

---
-- Rollback the transaction
--
-- @param Transaction transaction
-- @param function func
--
function MySQL.Async.rollbackTransaction(transaction, func)
    local rollbackTransactionTask = transaction.RollbackAsync(clr.System.Threading.CancellationToken.None);
    local callback = func or function() end

    clr.Brouznouf.FiveM.Async.RollbackTransactionCallback(rollbackTransactionTask, MySQL.Async.wrapQuery(
        callback,
        transaction.Connection,
        'ROLLBACK'
    ))
end

function MySQL.Async.wrapQuery(next, Connection, Message)
    local Stopwatch = clr.System.Diagnostics.Stopwatch()
    Stopwatch.Start()

    return function (Result, Error)
        if Error ~= nil then
            Logger:Error(Error.ToString())

            return nil
        end

        Stopwatch.Stop()
        Logger:Info(string.format('[%dms] %s', Stopwatch.ElapsedMilliseconds, Message))
        Result = next(Result)

        if Connection then
            Connection.Close()
        end

        return Result
    end
end
