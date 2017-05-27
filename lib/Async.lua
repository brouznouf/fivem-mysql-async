
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
        clr.Brouznouf.FiveM.Async.ExecuteCallback(executeTask.GetAwaiter(), function(Result)
            func(Result)
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
        clr.Brouznouf.FiveM.Async.FetchAllCallback(executeReaderTask.GetAwaiter(), function (reader)
            func(MySQL.Utils.ConvertResultToTable(reader));
        end)
    end

    return MySQL.Utils.CreateCoroutineFromTask(executeReaderTask, MySQL.Utils.ConvertResultToTable)
end

