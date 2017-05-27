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
    local reflection = clr.System.Reflection

    reflection.Assembly.LoadFrom('resources/mysql-async/lib/MySqlConnector.dll')
    reflection.Assembly.LoadFrom('resources/mysql-async/lib/Async.dll')

    self.mysql = clr.MySql.Data.MySqlClient
end

---
-- Create a new connection
--
-- @param self
--
function MySQL.createConnection(self)
    local connection = self.mysql.MySqlConnection("server="..self.Config.Host..";database="..self.Config.Database..";userid="..self.Config.User..";password="..self.Config.Password.."")
    connection.Open()

    return connection
end

MySQL:init()
