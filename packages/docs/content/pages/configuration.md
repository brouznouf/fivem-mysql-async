---
id: 21
---
## Configuration

*ghmattimysql* can be configured by two different means. The first option would be editing the
attached `config.json` for the middleware to connect to the database. The second option
would be by using the variable `mysql_connection_string` in your server configuration file. 
Should you prefer using the variable approach, make sure to delete the `config.json` in the
`/resources/ghmattimysql/` folder.

The `mysql_connection_string` needs to be set in accordance to the options below and it would take the following
shape in the server configuration file.

```
set mysql_connection_string "mysql://user:password@host/database?debug=true&charset=utf8mb4"
```

Please make sure the `mysql_connection_string` is set before the line containing `ensure ghmattimysql`.
