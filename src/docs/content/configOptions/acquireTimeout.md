---
id: 21
name: 'acquireTimeout'
---
The milliseconds before a timeout occurs during the connection acquisition. This is slightly different from `connectTimeout`,
because acquiring a pool connection does not always involve making a connection. If a connection request is queued,
the time the request spends in the queue does not count towards this timeout. (Default: `10000`)