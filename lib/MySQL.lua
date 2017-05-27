MySQL = setmetatable({}, MySQL)
MySQL.__index = MySQL

---
-- Configure the MySQL Connection and Load the necessary lib
--
-- @param self
-- @param server
-- @param database
-- @param user
-- @param password
--
function MySQL.configure(self, server, database, user, password)
    local reflection = clr.System.Reflection

    reflection.Assembly.LoadFrom('resources/mysql-async/lib/MySqlConnector.dll')
    reflection.Assembly.LoadFrom('resources/mysql-async/lib/Async.dll')

    self.mysql = clr.MySql.Data.MySqlClient

    self.server = server;
    self.database = database;
    self.user = user;
    self.password = password;
end

---
-- Create a new connection
--
-- @param self
--
function MySQL.createConnection(self)
    local connection = self.mysql.MySqlConnection("server="..self.server..";database="..self.database..";userid="..self.user..";password="..self.password.."")
    connection.Open()

    return connection
end

---
-- Execute a query with no result required
--
-- @param self
-- @param query
-- @param params
-- @param func
--
function MySQL.executeAsync(self, query, params, func)
    local command = self:createConnection().CreateCommand()
    command.CommandText = query

    if type(params) == "table" then
        for param in pairs(params) do
            command.CommandText = string.gsub(command.CommandText, param, self:escape(params[param]))
        end
    end

    local executeTask = command.ExecuteNonQueryAsync();

    if func ~= null then
        clr.Brouznouf.FiveM.Async.ExecuteCallback(executeTask.GetAwaiter(), function(Result)
            func(Result)
        end)
    end

    return CreateCoroutineFromTask(executeTask, function (Result)
        return Result
    end)
end

function MySQL.execute(self, query, params)
    local status, value = self:executeAsync(query, params).resume()

    return value;
end

---
-- Execute a query and fetch all results in an async way
--
-- @param self
-- @param query
-- @param params
-- @param func
--
function MySQL.fetchAllAsync(self, query, params, func)
    local command = MySQL:createConnection().CreateCommand()
    command.CommandText = query

    if type(params) == "table" then
        for param in pairs(params) do
            command.CommandText = string.gsub(command.CommandText, param, self:escape(params[param]))
        end
    end

    local executeReaderTask = command.ExecuteReaderAsync();

    if func ~= null then
        clr.Brouznouf.FiveM.Async.FetchAllCallback(executeReaderTask.GetAwaiter(), function (reader)
            func(ConvertResultToTable(reader));
        end)
    end

    return CreateCoroutineFromTask(executeReaderTask, ConvertResultToTable)
end

function MySQL.fetchAll(self, query, params)
    local status, value = self:fetchAllAsync(query, params).resume();

    return value;
end

function MySQL.escape(self, str)
    return self.mysql.MySqlHelper.EscapeString(str)
end

function ConvertResultToTable(MySqlDataReader)
    local result = {}

    while MySqlDataReader:Read() do
        for i=0,MySqlDataReader.FieldCount-1 do
            local line = {}

            line[MySqlDataReader.GetName(i)] = ConvertFieldValue(MySqlDataReader, i);

            result[#result+1] = line;
        end
    end

    return result;
end

function ConvertFieldValue(MysqlDataReader, index)
    local type = tostring(MysqlDataReader:GetFieldType(index))

    if type == "System.DateTime" then
        return MysqlDataReader:GetDateTime(index)
    end

    if type == "System.Double" then
        return MysqlDataReader:GetDouble(index)
    end

    if type == "System.Int32" then
        return MysqlDataReader:GetInt32(index)
    end

    if type == "System.Int64" then
        return MysqlDataReader:GetInt64(index)
    end

    return MysqlDataReader:GetString(index)
end

function CreateCoroutineFromTask(Task, Transformer)
    return coroutine.create(function()
        coroutine.yield(Transformer(Task.GetAwaiter().GetResult()))
    end)
end