---
-- Execute a query in a sync way
--
-- @param string      query  The SQL Query
-- @param object|null params Parameters to replace in the query, which will be escaped
--
-- @return int
--
function MySQL.Sync.execute(query, params, transaction)
    local status, value = MySQL.Async.execute(query, params, nil, transaction).resume()

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
function MySQL.Sync.fetchAll(query, params, transaction)
    local status, value = MySQL.Async.fetchAll(query, params, nil, transaction).resume();

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
function MySQL.Sync.fetchScalar(query, params, transaction)
    local status, value = MySQL.Async.fetchScalar(query, params, nil, transaction).resume();

    return value;
end

---
-- Create a Transaction
--
-- @return Transaction
--
function MySQL.Sync.beginTransaction()
    local status, value = MySQL.Async.beginTransaction().resume();

    return value;
end

---
-- Commit a transaction
--
-- @param Transaction transaction
--
function MySQL.Sync.commitTransaction(transaction)
    local status, value = MySQL.Async.commitTransaction(transaction).resume();

    return value;
end

---
-- Rollback a transaction
--
-- @param Transaction transaction
--
function MySQL.Sync.rollbackTransaction(transaction)
    local status, value = MySQL.Async.rollbackTransaction(transaction).resume();

    return value;
end

