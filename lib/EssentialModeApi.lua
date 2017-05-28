--
-- Contains MySQL method to be compatible with EssentialMode < 3.0
--
-- This functions are however deprecated, you should change them in a near future
--

Logger:Debug('EssentialModeApi is deprecated, please use the new API instead')

-- @deprecated
function MySQL.open(self, server, database, userid, password)
    Logger:Debug('MySQL:open is deprecated and is not needed anymore, you can safely remove this call')
end

--- @deprecated
function MySQL.executeQuery(self, command, params)
    Logger:Debug('MySQL:executeQuery is deprecated, please use MySQL.Sync.execute or MySQL.Async.execute instead')
    -- Replace '@name' with @name as ' are not needed anymore
    command = string.gsub(command, "'(@.+?)'", "%1")

    local c = MySQL.Utils.CreateCommand(command, params)
    local res = c.ExecuteNonQuery()

    print("Query Executed("..res.."): " .. c.CommandText)

    return {mySqlCommand = c, result = res}
end

--- @deprecated
function MySQL.getResults(self, mySqlCommand, fields, byField)
    Logger:Debug('MySQL:getResults is deprecated, please use MySQL.Sync.fetchAll or MySQL.Async.fetchAll instead')
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

--- @deprecated
function MySQL.escape(self, str)
    Logger:Fatal('This method is deprecated and is not safe to use, avoid it')
    return str
end

--- @deprecated
function MySQL._getFieldByName(self, MysqlDataReader, name)
    return MySQL.Utils.ConvertFieldValue(MysqlDataReader, MysqlDataReader.GetOrdinal(name))
end
