MySQL = setmetatable({}, MySQL)
MySQL.__index = MySQL
MySQL.Utils = setmetatable({}, MySQL)
MySQL.Async = setmetatable({}, MySQL)
MySQL.Sync = setmetatable({}, MySQL)
MySQL.Config = setmetatable({}, MySQL)

require "resources/mysql-async/lib/config"
require "resources/mysql-async/lib/Logger"
require "resources/mysql-async/lib/Utils"
require "resources/mysql-async/lib/Async"
require "resources/mysql-async/lib/Sync"

---
-- Configure the MySQL Connection and Load the necessary lib
--
-- @param self
-- @param server
-- @param database
-- @param user
-- @param password
--
function MySQL.init(self)
    local isInit = false

    -- Very Ugly need to be done better
    foreach assembly in clr.System.AppDomain.CurrentDomain.GetAssemblies() do
        if assembly.ToString() == "Async, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" then
            isInit = true
        end
    end

    local reflection = clr.System.Reflection

    reflection.Assembly.LoadFrom('resources/mysql-async/lib/MySqlConnector.dll')
    reflection.Assembly.LoadFrom('resources/mysql-async/lib/Async.dll')

    self.mysql = clr.MySql.Data.MySqlClient
    self.isInit = true;
    self.settings = clr.MySql.Data.MySqlClient.MySqlConnectionStringBuilder("server="..self.Config.Host..";database="..self.Config.Database..";userid="..self.Config.User..";password="..self.Config.Password.."")
    self.settings.AllowUserVariables = true

    return self.mysql, isInit
end

---
-- Create a new connection
--
-- @param self
--
function MySQL.createConnection(self)
    local connection = self.mysql.MySqlConnection(self.settings)
    connection.Open()

    return connection
end

local function ClearPoolLoop(mysql)
    SetTimeout(180000, function()
        Logger:Info('Clear MySQL connection pool')
        mysql.MySqlConnection.ClearAllPools()

        ClearPoolLoop(mysql)
    end)
end

local mysql, isInit = MySQL:init()

if not isInit then
    ClearPoolLoop(mysql)
end
