---
id: 2
name: 'mysql_debug_output'
---
Sets the location where to output information from `mysql_debug`.
Possible options are `console`, `file`, and `both`.
In case of a file output, the file will be located in the current working directory
on starting the server, named like the resource, e.g. `/ghmattimysql-<timestamp>.log`
(Default: `console`)