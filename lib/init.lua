AddEventHandler('onServerResourceStart', function (resource)
    if resource == "mysql-async" then
        exports['mysql-async']:mysql_configure()

        TriggerEvent('onMySQLReady')
    end
end)
