
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

    clr.Brouznouf.FiveM.Async.ExecuteCallback(executeTask, LogWrapper(
        ResultCallback(callback),
        Command.Connection.ServerThread,
        Command.CommandText
    ))

    return MySQL.Utils.CreateCoroutineFromTask(executeTask, NoTransform)
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

    clr.Brouznouf.FiveM.Async.ExecuteReaderCallback(executeReaderTask, LogWrapper(
        ResultCallback(function (Result)
            if (func ~= nil) then
                return callback(MySQL.Utils.ConvertResultToTable(Result))
            end

            return nil
        end),
        Command.Connection.ServerThread,
        Command.CommandText
    ))

    -- This is mainly to avoid 2 calls to convert result as it will fail
    if func ~= nil then
        return coroutine.create(function () coroutine.yield(nil) end)
    end

    return MySQL.Utils.CreateCoroutineFromTask(executeReaderTask, MySQL.Utils.ConvertResultToTable)
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

    clr.Brouznouf.FiveM.Async.ExecuteScalarCallback(executeScalarTask, LogWrapper(
        ResultCallback(callback),
        Command.Connection.ServerThread,
        Command.CommandText
    ))

    return MySQL.Utils.CreateCoroutineFromTask(executeScalarTask, NoTransform)
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

    clr.Brouznouf.FiveM.Async.BeginTransactionCallback(beginTransactionTask, LogWrapper(
        NoResultCallback(callback),
        connection.ServerThread,
        'BEGIN TRANSACTION'
    ))

    return MySQL.Utils.CreateCoroutineFromTask(beginTransactionTask, NoTransform)
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

    clr.Brouznouf.FiveM.Async.CommitTransactionCallback(commitTransactionTrask, LogWrapper(
        NoResultCallback(callback),
        transaction.Connection.ServerThread,
        'COMMIT'
    ))

    return MySQL.Utils.CreateCoroutineFromTask(commitTransactionTrask, NoTransform)
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

    clr.Brouznouf.FiveM.Async.RollbackTransactionCallback(rollbackTransactionTask, LogWrapper(
        NoResultCallback(callback),
        transaction.Connection.ServerThread,
        'ROLLBACK'
    ))

    return MySQL.Utils.CreateCoroutineFromTask(rollbackTransactionTask, NoTransform)
end

function NoTransform(Result)
    return Result
end

function ResultCallback(next)
    return function(Result, Error)
        if Error ~= nil then
            Logger:Error(Error.ToString())
        else
            next(Result)
        end
    end
end

function NoResultCallback(next)
    return function(Result, Error)
        if Error ~= nil then
            Logger:Error(Error.ToString())
        else
            next()
        end
    end
end

function LogWrapper(next, ServerThread, Message)
    local Stopwatch = clr.System.Diagnostics.Stopwatch()
    Stopwatch.Start()

    return function (Result, Error)
        Stopwatch.Stop()
        Logger:Info(string.format('[%d][%dms] %s', ServerThread, Stopwatch.ElapsedMilliseconds, Message))

        return next(Result, Error)
    end
end
