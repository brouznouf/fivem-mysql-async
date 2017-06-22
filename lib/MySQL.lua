MySQL = setmetatable({}, MySQL)
MySQL.__index = MySQL
MySQL.Utils = setmetatable({}, MySQL)
MySQL.Async = setmetatable({}, MySQL)
MySQL.Sync = setmetatable({}, MySQL)
MySQL.Config = setmetatable({}, MySQL)

local function safeParameters(params)
    if nil == params then
        return {[''] = ''}
    end

    if next(params) == nil then
        return {[''] = ''}
    end

    return params
end

function MySQL.init(self)
    exports['mysql-async']:mysql_configure(self.Config.Host, self.Config.User, self.Config.Password, self.Config.Database)
end

function MySQL.Sync.execute(query, params)
    return exports['mysql-async']:mysql_sync_execute(query, safeParameters(params))
end

function MySQL.Sync.fetchAll(query, params)
    return exports['mysql-async']:mysql_sync_fetch_all(query, safeParameters(params))
end

function MySQL.Sync.fetchScalar(query, params)
    return exports['mysql-async']:mysql_sync_fetch_scalar(query, safeParameters(params))
end

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
function MySQL.Async.execute(query, params, func)
    exports['mysql-async']:mysql_execute(query, safeParameters(params), func)
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
function MySQL.Async.fetchAll(query, params, func)
    exports['mysql-async']:mysql_fetch_all(query, safeParameters(params), func)
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
function MySQL.Async.fetchScalar(query, params, func)
    exports['mysql-async']:mysql_fetch_scalar(query, safeParameters(params), func)
end

AddEventHandler('onServerResourceStart', function (resource)
    if resource == "mysql-async" then
        MySQL:init()

        TriggerEvent('onMySQLReady')
    end
end)
