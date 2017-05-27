MySQL = setmetatable({}, MySQL)
MySQL.__index = MySQL
MySQL.Utils = setmetatable({}, MySQL)
MySQL.Async = setmetatable({}, MySQL)
MySQL.Sync = setmetatable({}, MySQL)

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

MySQL:configure("127.0.0.1", "fivem", "root", "000")