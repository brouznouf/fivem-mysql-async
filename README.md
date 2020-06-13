### Introduction

This mysql-async Library for FiveM intends to provide function to connect to a MySQL in a Sync and Async way.

### Documentation

Check out https://brouznouf.github.io/fivem-mysql-async/ for a complete documentation.

### Questions
For help and support questions, please use [Discord](https://discord.gg/AXcxRjt). I would like to keep the issues in this repository for bugs and feature requests only.

### Issues
Make sure you provide all information possible when reporting an issue.

### Changelog
For a detailed changelog either check the commits or read https://github.com/brouznouf/fivem-mysql-async/releases

### Contributing
Help to expand sensibly on the middleware is always welcome. 

### Features

 * Async / Sync.
 * It uses the https://github.com/mysqljs/mysql library to provide a connection to your mysql server.
 * Create and close a connection for each query, the underlying library use a connection pool so only the
mysql auth is done each time, old tcp connections are keeped in memory for performance reasons.
