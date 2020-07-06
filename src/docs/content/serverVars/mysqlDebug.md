---
id: 1
name: 'mysql_debug'
---
Possible options are `Console`, `File`, `FileAndConsole` and `None`.
In case of a file output, the file will be located in the current working directory
on starting the server, named like `/<resourcename>-<timestamp>.log`. The name of the
file can be changed by setting `mysql_log_file_format`.
(Default: `None`)