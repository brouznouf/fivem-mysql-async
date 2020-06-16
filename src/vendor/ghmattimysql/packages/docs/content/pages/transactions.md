---
id: 41
---

## Transactions
      
Transactions in *ghmattimysql* support two different syntaxes. One where the parameters are embedded in the query
`object` and one where it is supplied as an argument to the `transaction` export itself. The query object
follows this structure `[{query: string, values: object | array}]`. Similar to the `execute` export,
the `values` field supports, like the `parameters` argument to the function, either the newer mysql.js
type of parameters or the old version that the C# connector uses.

A transaction will only commit all queries to the database, if all queries to the database succeed. If one of them fails,
no changes to the database will be made. This can be easily used when e.g. transfering money, making sure that the money
field is positive. A transaction would fail if someone would attempt to have negative cash, so that no money would be
transfered.


Since the transaction will either fail or succeed, the callback of the function will either answer with `true`
or `false` depending on if the transaction succeeded. If it fails an error message will be printed, but it is
an intended one, since the commit to the database would be likely unwanted.

```typescript
transaction(query: string[], parameters?: object | array, callback?: function): void
transaction(query: object[], callback?: function): void
transactionSync(query: string[], parameters?: object | array): result
transactionSync(query: object[]): result
```

While transactions do support seperate `parameters` as an `array`, it has very limited use cases,
as if the parameter is supplied not inside the query `object`, but as an argument to the function, it will be
applied to every query `string`, which could lead to executing the same query accidently twice.


Example of a transaction using the `parameters` field in `JavaScript`.

```js
exports.ghmattimysql.transaction([
    'UPDATE users SET cash = cash - @transfer WHERE id = @senderId',
    'UPDATE users SET cash = cash + @transfer WHERE id = @recipientId'
  ], { transfer: amount, senderId, recipientId }, (success) => {
    console.log(`${success ? 'Succeeded' : 'Failed'} in transfering $${amount} cash.`)
  }
);
```

Example of the same transaction not using the `parameters` field in `JavaScript`.
This example also supports as values the C# syntax with the `@` values.

```js
exports.ghmattimysql.transaction([
    { query: 'UPDATE users SET cash = cash - ? WHERE id = ?', values: [amount, senderId] },
    { query: 'UPDATE users SET cash = cash + ? WHERE id = ?', values: [amount, recipientId] },
  ], (success) => {
    console.log(`${success ? 'Succeeded' : 'Failed'} in transfering $${amount} cash.`)
  }
);
```

This syntax is better when you have two distinct set of values, but if half or more of the values are shared,
the first syntax might be preferable, due to it being more concise then.