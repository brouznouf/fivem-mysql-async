---
id: 36
---

 #### Store

The store export should be used for storing query strings, when a lot of queries are expected to be triggered at once.
The idea behind this feature is, that while recieving data puts stress on your server infrastructure, so does sending data.
And the biggest polluter for this resource is sending overly long and complicated query strings.

While the server is running you want to minimize the impact of sending a lot of queries at once puts on your architecture,
thus you can already store these queries ahead of time, and just pass the id returned by the callback function and pass the
parameters for these queries along.

```typescript
store(query: string, callback?: function): void
```

As an example you can see here

```js
let myQueryId = -1;
exports.ghmattimysql.store('SELECT identifier, cash, online FROM users WHERE ?', (storeId) => {
  myQueryId = storeId;
});
/*... this is 49 characters stored
 * if the following function gets triggered once per online player
 * and there is 60 players on the servers, that would mean we send
 * about 3000 characters in one tick through this export.
 * if you run into even worse programming and every player triggers it
 * now you are stuck with sending 176k characters.
 * 
 * with store it is reduced to just one number.
 */
onNet('getInfoFromId', (id) => {
  const src = global.source;
  exports.ghmattimysql.execute(myQueryId, [{ id }], (result) => {
    if (result.length) emitNet('recieveInfo', src, { ...result[0], id });
  });
});
```
