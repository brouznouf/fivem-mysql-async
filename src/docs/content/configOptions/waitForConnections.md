---
id: 22
name: 'waitForConnections'
---
Determines the pool's action when no connections are available and the limit has been reached. If `true`,
the pool will queue the connection request and call it when one becomes available. If `false`, the pool
will immediately call back with an error. (Default: `true`)