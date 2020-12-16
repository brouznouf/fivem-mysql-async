MySQL = {
    Async = {},
    Sync = {},
}

local function safeParameters(params)
    if nil == params then
        return {[''] = ''}
    end

    assert(type(params) == "table", "A table is expected")

    if next(params) == nil then
        return {[''] = ''}
    end

    return params
end

---
-- Execute a query with no result required, sync version
--
-- @param query
-- @param params
--
-- @return int Number of rows updated
--
function MySQL.Sync.execute(query, params)
    assert(type(query) == "string" or type(query) == "number", "The SQL Query must be a string")

    local res = 0
    local finishedQuery = false
    exports['mysql-async']:mysql_execute(query, safeParameters(params), function (result)
        res = result
        finishedQuery = true
    end)
    repeat Citizen.Wait(0) until finishedQuery == true
    return res
end
---
-- Execute a query and fetch all results in an sync way
--
-- @param query
-- @param params
--
-- @return table Query results
--
function MySQL.Sync.fetchAll(query, params)
    assert(type(query) == "string" or type(query) == "number", "The SQL Query must be a string")

    local res = {}
    local finishedQuery = false
    exports['mysql-async']:mysql_fetch_all(query, safeParameters(params), function (result)
        res = result
        finishedQuery = true
    end)
    repeat Citizen.Wait(0) until finishedQuery == true
    return res
end

---
-- Execute a query and fetch the first result in an sync way
--
-- @param query
-- @param params
--
-- @return table Query results
--
function MySQL.Sync.fetchFirst(query, params)
    assert(type(query) == "string" or type(query) == "number", "The SQL Query must be a string")

    local res = {}
    local finishedQuery = false
    exports['mysql-async']:mysql_fetch_all(query, safeParameters(params), function (result)
        res = result
        finishedQuery = true
    end)
    repeat Citizen.Wait(0) until finishedQuery == true
    return res[1]
end

---
-- Execute a query and fetch the first column of the first row, sync version
-- Useful for count function by example
--
-- @param query
-- @param params
--
-- @return mixed Value of the first column in the first row
--
function MySQL.Sync.fetchScalar(query, params)
    assert(type(query) == "string" or type(query) == "number", "The SQL Query must be a string")

    local res = ''
    local finishedQuery = false
    exports['mysql-async']:mysql_fetch_scalar(query, safeParameters(params), function (result)
        res = result
        finishedQuery = true
    end)
    repeat Citizen.Wait(0) until finishedQuery == true
    return res
end

---
-- Execute a query and retrieve the last id insert, sync version
--
-- @param query
-- @param params
--
-- @return mixed Value of the last insert id
--
function MySQL.Sync.insert(query, params)
    assert(type(query) == "string" or type(query) == "number", "The SQL Query must be a string")

    local res = 0
    local finishedQuery = false
    exports['mysql-async']:mysql_insert(query, safeParameters(params), function (result)
        res = result
        finishedQuery = true
    end)
    repeat Citizen.Wait(0) until finishedQuery == true
    return res
end

---
-- Stores a query for later execution
--
-- @param query
--
function MySQL.Sync.store(query)
    assert(type(query) == "string", "The SQL Query must be a string")

    local res = -1
    local finishedQuery = false
    exports['mysql-async']:mysql_store(query, function (result)
        res = result
        finishedQuery = true
    end)
    repeat Citizen.Wait(0) until finishedQuery == true
    return res
end

---
-- Execute a List of querys and returns bool true when all are executed successfully
--
-- @param querys
-- @param params
--
-- @return bool if the transaction was successful
--
function MySQL.Sync.transaction(querys, params)
    local res = 0
    local finishedQuery = false
    exports['mysql-async']:mysql_transaction(querys, params, function (result)
        res = result
        finishedQuery = true
    end)
    repeat Citizen.Wait(0) until finishedQuery == true
    return res
end

---
-- Execute a query with no result required, async version
--
-- @param query
-- @param params
-- @param func(int)
--
function MySQL.Async.execute(query, params, func)
    assert(type(query) == "string" or type(query) == "number", "The SQL Query must be a string")

    exports['mysql-async']:mysql_execute(query, safeParameters(params), func)
end

---
-- Execute a query and fetch all results in an async way
--
-- @param query
-- @param params
-- @param func(table)
--
function MySQL.Async.fetchAll(query, params, func)
    assert(type(query) == "string" or type(query) == "number", "The SQL Query must be a string")

    exports['mysql-async']:mysql_fetch_all(query, safeParameters(params), func)
end

---
-- Execute a query and fetch the first results in an async way
--
-- @param query
-- @param params
-- @param func(table)
--
function MySQL.Async.fetchFirst(query, params, func)
    assert(type(query) == "string" or type(query) == "number", "The SQL Query must be a string")

    exports['mysql-async']:mysql_fetch_all(query, safeParameters(params), function(result) if func then func(result[1]) end end)
end


---
-- Execute a query and fetch the first column of the first row, async version
-- Useful for count function by example
--
-- @param query
-- @param params
-- @param func(mixed)
--
function MySQL.Async.fetchScalar(query, params, func)
    assert(type(query) == "string" or type(query) == "number", "The SQL Query must be a string")

    exports['mysql-async']:mysql_fetch_scalar(query, safeParameters(params), func)
end

---
-- Execute a query and retrieve the last id insert, async version
--
-- @param query
-- @param params
-- @param func(string)
--
function MySQL.Async.insert(query, params, func)
    assert(type(query) == "string" or type(query) == "number", "The SQL Query must be a string")

    exports['mysql-async']:mysql_insert(query, safeParameters(params), func)
end

---
-- Stores a query for later execution
--
-- @param query
-- @param func(number)
--
function MySQL.Async.store(query, func)
    assert(type(query) == "string", "The SQL Query must be a string")

    exports['mysql-async']:mysql_store(query, func)
end

---
-- Execute a List of querys and returns bool true when all are executed successfully
--
-- @param querys
-- @param params
-- @param func(bool)
--
function MySQL.Async.transaction(querys, params, func)
    return exports['mysql-async']:mysql_transaction(querys, params, func)
end

function MySQL.ready (callback)
    Citizen.CreateThread(function ()
        -- add some more error handling
        while GetResourceState('mysql-async') ~= 'started' do
            Citizen.Wait(0)
        end
        while not exports['mysql-async']:is_ready() do
            Citizen.Wait(0)
        end
        callback()
    end)
end
