
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
    local type = tostring(MysqlDataReader:GetFieldType(index))

    if MysqlDataReader.IsDBNull(index) then
        return nil
    end

    if type == "System.DateTime" then
        -- Some date time cannot be parsed like 0000-01-01
        local status, data = pcall(MysqlDataReader.GetDateTime, index)

        if status then
            return data
        end

        Logger:Warn(data)

        return nil
    end

    if type == "System.Double" then
        return MysqlDataReader.GetDouble(index)
    end

    if type == "System.Int32" or type == "System.UInt32" then
        return MysqlDataReader.GetInt32(index)
    end

    if type == "System.Int64" or type == "System.UInt64" then
        return MysqlDataReader.GetInt64(index)
    end

    if type == "System.Boolean" then
        return MysqlDataReader.GetBoolean(index)
    end

    return MysqlDataReader.GetString(index)
end