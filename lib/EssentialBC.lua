--
-- Contains MySQL method to be compatible with EssentialMode < 3.0
--
-- This functions are however deprecated, you should change them in a near future
--

function MySQL.open(self, server, database, userid, password)
    return MySQL.configure(server, database, userid, password)
end

function MySQL.executeQuery(self, command, params)
    local c = MySQL.Utils.CreateCommand(command, params)
    local res = c.ExecuteNonQuery()

    print("Query Executed("..res.."): " .. c.CommandText)

    return {mySqlCommand = c, result = res}
end

function MySQL.getResults(self, mySqlCommand, fields, byField)
    if type(fields) ~= "table" or #fields == 0 then
        return nil
    end

    if type(mySqlCommand) == "table" and mySqlCommand['mySqlCommand'] ~= nil then
        mySqlCommand = mySqlCommand['mySqlCommand']
    end

    local reader = mySqlCommand:ExecuteReader()
    local result = {}
    local c = nil

    while reader:Read() do
        c = #result+1
        result[c] = {}

        for field in pairs(fields) do
            result[c][fields[field]] = self:_getFieldByName(reader, fields[field])
        end
    end

    reader:Close()
    return result
end

function MySQL.escape(self, str)
    return MySQL.Utils.escape(str)
end

function MySQL._getFieldByName(self, MysqlDataReader, name)
    return MySQL.Utils.ConvertFieldValue(MysqlDataReader, MysqlDataReader.GetOrdinal(name))
end
