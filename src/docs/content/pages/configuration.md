---
id: 21
---
## Configuration

*mysql-async* is configured by setting `set mysql_connection_string "[string]"`. The connection string can either be formatted like an url:
```
set mysql_connection_string "mysql://user:password@host/database?charset=utf8mb4"
```
Here options are chained `&`. The other option is to to use an option string where each variable is seperated by an `;`, which would look like:
```
set mysql_connection_string "database=mysqlasync;charset=utf8mb4"
```
The configuration options available for these strings are listed below. 
