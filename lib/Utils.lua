
---
-- Create a MySQL Command from a query string and its parameters
--
-- @param Query
-- @param Parameters
--
-- @return DbCommand
--
function MySQL.Utils.CreateCommand(Query, Parameters, Transaction)
    local Command

    if transaction == nil then
        Command = MySQL:createConnection().CreateCommand()
    else
        Command = Transaction.Connection.CreateCommand()
    end

    Command.CommandText = Query

    if type(Parameters) == "table" then
        for Param in pairs(Parameters) do
            Command.Parameters.AddWithValue(Param, Parameters[Param])
        end
    end

    return Command
end

---
-- Convert a result from MySQL to an object in lua
-- Take not that the reader will be closed after that
--
-- @param MySqlDataReader
--
-- @return object
--
function MySQL.Utils.ConvertResultToTable(MySqlDataReader)
    local result = {}

    while MySqlDataReader:Read() do
        local line = {}

        for i=0,MySqlDataReader.FieldCount-1 do
            line[MySqlDataReader.GetName(i)] = MySQL.Utils.ConvertFieldValue(MySqlDataReader, i);
        end

        result[#result+1] = line;
    end

    MySqlDataReader.Close()
    MySqlDataReader.Dispose()

    return result;
end

---
-- Convert a indexed field into a good value for lua
--
-- @param MysqlDataReader
-- @param index
--
-- @return mixed
--
function MySQL.Utils.ConvertFieldValue(MysqlDataReader, index)
    if MysqlDataReader.IsDBNull(index) then
        return nil
    end

    -- Some date time cannot be parsed like 0000-01-01
    local status, data = pcall(MysqlDataReader.GetValue, index)

    if status then
        return MySQL.Utils.ConvertObject(data)
    end

    Logger:Warn(data)

    return nil
end

function MySQL.Utils.ConvertObject(Value)
    if type(Value) == "userdata" then
        local netType = tostring(Value.GetType())

        if netType == "System.DateTime" then
            local timestamp = Value.ToUniversalTime().Subtract(clr.System.DateTime(1970, 1, 1)).TotalSeconds

            return os.date("*t", tonumber(tostring(timestamp)))
        end

        if netType == "System.Double" then
            return tonumber(tostring(Value))
        end

        if netType == "System.Decimal" then
            return tonumber(tostring(Value))
        end

        if netType == "System.Int32" or netType == "System.UInt32" then
            return tonumber(tostring(Value))
        end

        if netType == "System.Int64" or netType == "System.UInt64" then
            return tonumber(tostring(Value))
        end

        if netType == "System.Boolean" then
            return toboolean(tostring(Value))
        end

        return tostring(Value)
    end

    return Value
end