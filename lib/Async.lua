
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

    if func ~= nil then
        clr.Brouznouf.FiveM.Async.ExecuteCallback(executeTask, LogWrapper(
            ResultCallback(func),
            Command.Connection.ServerThread,
            Command.CommandText
        ))
    end

    return MySQL.Utils.CreateCoroutineFromTask(executeTask, LogWrapper(
        NoTransform,
        Command.Connection.ServerThread,
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

    if func ~= nil then
        clr.Brouznouf.FiveM.Async.ExecuteReaderCallback(executeReaderTask, LogWrapper(
            ResultCallback(function (Result)
                return func(MySQL.Utils.ConvertResultToTable(Result))
            end),
            Command.Connection.ServerThread,
            Command.CommandText
        ))
    end

    return MySQL.Utils.CreateCoroutineFromTask(executeReaderTask, LogWrapper(
        MySQL.Utils.ConvertResultToTable,
        Command.Connection.ServerThread,
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

    if func ~= nil then
        clr.Brouznouf.FiveM.Async.ExecuteScalarCallback(executeScalarTask, LogWrapper(
            ResultCallback(func),
            Command.Connection.ServerThread,
            Command.CommandText
        ))
    end

    return MySQL.Utils.CreateCoroutineFromTask(executeScalarTask, LogWrapper(
        NoTransform,
        Command.Connection.ServerThread,
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

    if func ~= nil then
        clr.Brouznouf.FiveM.Async.BeginTransactionCallback(beginTransactionTask, LogWrapper(
            NoResultCallback(func),
            connection.ServerThread,
            'BEGIN TRANSACTION'
        ))
    end

    return MySQL.Utils.CreateCoroutineFromTask(beginTransactionTask, LogWrapper(
        NoTransform,
        connection.ServerThread,
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

    if func ~= nil then
        clr.Brouznouf.FiveM.Async.CommitTransactionCallback(commitTransactionTrask, LogWrapper(
            NoResultCallback(func),
            transaction.Connection.ServerThread,
            'COMMIT'
        ))
    end

    return MySQL.Utils.CreateCoroutineFromTask(commitTransactionTrask, LogWrapper(
        NoTransform,
        transaction.Connection.ServerThread,
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

    if func ~= nil then
        clr.Brouznouf.FiveM.Async.RollbackTransactionCallback(rollbackTransactionTask, LogWrapper(
            NoResultCallback(func),
            transaction.Connection.ServerThread,
            'ROLLBACK'
        ))
    end

    return MySQL.Utils.CreateCoroutineFromTask(rollbackTransactionTask, LogWrapper(
        NoTransform,
        transaction.Connection.ServerThread,
        'ROLLBACK'
    ))
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
