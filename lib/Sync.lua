---
-- Execute a query in a sync way
--
-- @param string      query  The SQL Query
-- @param object|null params Parameters to replace in the query, which will be escaped
--
-- @return int
--
function MySQL.Sync.execute(query, params)
    local status, value = MySQL.Async.execute(query, params).resume()

    return value;
end

---
-- Fetch result from database in a sync way
--
-- @param string      query  The SQL Query
-- @param object|null params Parameters to replace in the query, which will be escaped
--
-- @return object
--
function MySQL.Sync.fetchAll(query, params)
    local status, value = MySQL.Async.fetchAll(query, params).resume();

    return value;
end

---
-- Fetch result from the first row and first column in a sync way
--
-- @param string      query  The SQL Query
-- @param object|null params Parameters to replace in the query, which will be escaped
--
-- @return mixed
--
function MySQL.Sync.fetchScalar(query, params)
    local status, value = MySQL.Async.fetchScalar(query, params).resume();

    return value;
end

