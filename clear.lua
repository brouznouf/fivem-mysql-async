--- Activate this file if you want to clear sleeping connection every 10secs
require "resources/mysql-async/lib/MySQL"

local function ClearConnection()
    SetTimeout(10000, function ()
        MySQL.Async.fetchAll("SELECT concat('KILL ',id,';') as query FROM information_schema.processlist where user=@user and time > 10", {
            user = MySQL.Config.User
        }, function (result)
            local killString = ""

            for k,v in ipairs(result) do
                killString = killString .. v.query
            end

            if killString ~= "" then
                MySQL.Async.execute(killString)
            end
        end)

        ClearConnection()
    end)
end

ClearConnection()

