
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
        clr.Brouznouf.FiveM.Async.ExecuteCallback(executeTask, function(Result, Error)
            if Error ~= nil then
                Logger:Error(Error.ToString())
            else
                func(Result)
            end
        end)
    end

    return MySQL.Utils.CreateCoroutineFromTask(executeTask, function (Result)
        return Result
    end)
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
        clr.Brouznouf.FiveM.Async.ExecuteReaderCallback(executeReaderTask, function (Reader, Error)
            if Error ~= nil then
                Logger:Error(Error.ToString())
            else
                func(MySQL.Utils.ConvertResultToTable(Reader));
            end
        end)
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

    if func ~= nil then
        clr.Brouznouf.FiveM.Async.ExecuteScalarCallback(executeScalarTask, function(Result, Error)
            if Error ~= nil then
                Logger:Error(Error.ToString())
            else
                func(Result)
            end
        end)
    end

    return MySQL.Utils.CreateCoroutineFromTask(executeScalarTask, function (Result)
        return Result
    end)
end

---
-- Create a transaction
--
-- @param function func
--
-- @return coroutine
--
function MySQL.Async.beginTransaction(func)
    local beginTransactionTask = MySQL:createConnection().BeginTransactionAsync(clr.System.Threading.CancellationToken.None);

    if func ~= nil then
        clr.Brouznouf.FiveM.Async.BeginTransactionCallback(beginTransactionTask, function(Result, Error)
            if Error ~= nil then
                Logger:Error(Error.ToString())
            else
                func(Result)
            end
        end)
    end

    return MySQL.Utils.CreateCoroutineFromTask(beginTransactionTask, function (Result)
        return Result
    end)
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
        clr.Brouznouf.FiveM.Async.CommitTransactionCallback(commitTransactionTrask, function(Result, Error)
            if Error ~= nil then
                Logger:Error(Error.ToString())
            else
                func()
            end

            transaction.Dispose();
        end)
    end

    return MySQL.Utils.CreateCoroutineFromTask(commitTransactionTrask, function (Result)
        return Result
    end)
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
        clr.Brouznouf.FiveM.Async.RollbackTransactionCallback(rollbackTransactionTask, function(Result, Error)
            if Error ~= nil then
                Logger:Error(Error.ToString())
            else
                func()
            end

            transaction.Dispose();
        end)
    end

    return MySQL.Utils.CreateCoroutineFromTask(rollbackTransactionTask, function (Result)
        return Result
    end)
end
