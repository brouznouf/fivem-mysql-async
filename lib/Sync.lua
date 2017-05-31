---
-- Execute a query in a sync way
--
-- @param string      query  The SQL Query
-- @param object|null params Parameters to replace in the query, which will be escaped
--
-- @return int
--
function MySQL.Sync.execute(query, params, transaction)
    local Command = MySQL.Utils.CreateCommand(query, params, transaction)
    local connection

    if transaction then
        connection = nil
    else
        connection = Command.connection
    end

    return MySQL.Sync.wrapQuery(Command.ExecuteNonQuery, connection, Command.CommandText)
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
    local Command = MySQL.Utils.CreateCommand(query, params, transaction)
    local connection

    if transaction then
        connection = nil
    else
        connection = Command.connection
    end

    return MySQL.Sync.wrapQuery(Command.ExecuteReader, connection, Command.CommandText, MySQL.Utils.ConvertResultToTable)
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
    local Command = MySQL.Utils.CreateCommand(query, params, transaction)
    local connection

    if transaction then
        connection = nil
    else
        connection = Command.connection
    end

    return MySQL.Sync.wrapQuery(Command.ExecuteScalar, connection, Command.CommandText)
end

---
-- Create a Transaction
--
-- @return Transaction
--
function MySQL.Sync.beginTransaction()
    local connection = MySQL:createConnection();

    return MySQL.Sync.wrapQuery(connection.BeginTransaction, nil, 'BEGIN TRANSACTION')
end

---
-- Commit a transaction
--
-- @param Transaction transaction
--
function MySQL.Sync.commitTransaction(transaction)
    return MySQL.Sync.wrapQuery(transaction.Commit, transaction.Connection, 'COMMIT')
end

---
-- Rollback a transaction
--
-- @param Transaction transaction
--
function MySQL.Sync.rollbackTransaction(transaction)
    return MySQL.Sync.wrapQuery(transaction.Rollback, transaction.Connection, 'COMMIT')
end

function MySQL.Sync.wrapQuery(call, Connection, Message, Transformer)
    Transformer = Transformer or function(Result) return Result end
    local asyncWrapper = MySQL.Async.wrapQuery(
        function (Result)
            return Result
        end,
        Connection,
        Message
    )

    local status, result = pcall(call)

    if not status then
        return asyncWrapper(nil, result)
    end

    return asyncWrapper(Transformer(result), nil)
end

