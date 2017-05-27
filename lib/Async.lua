
---
-- Execute a query with no result required
--
-- @param query
-- @param params
-- @param func
--
function MySQL.Async.execute(query, params, func)
    local Command = MySQL.Utils.CreateCommand(query, params)
    local executeTask = Command.ExecuteNonQueryAsync();

    if func ~= null then
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
--
function MySQL.Async.fetchAll(query, params, func)
    local Command = MySQL.Utils.CreateCommand(query, params)
    local executeReaderTask = Command.ExecuteReaderAsync();

    if func ~= null then
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
--
function MySQL.Async.fetchScalar(query, params, func)
    local Command = MySQL.Utils.CreateCommand(query, params)
    local executeScalarTask = Command.ExecuteScalarAsync();

    if func ~= null then
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
