---
id: 11
name: 'mysql_log_file_format'
---
Sets the log file format, relative to the working directory of the server. If `mysql_debug` is not set to File or FileAndConsole,
then this option is useless. `%s` is replaced with the name of the resource, `%d` is replaced by a timestamp.
(Default: `%s-%d.log`)