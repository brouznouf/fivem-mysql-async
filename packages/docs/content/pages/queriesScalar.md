---
id: 35
---

 #### Scalar

The scalar export is a cut-down execute for `SELECT` only, it only returns a singular value, e.g. it will fetch the first
column of the first row selected.
````typescript
scalar(query: string, parameters?: object | array, callback?: function): void
scalar(query: string, callback?: function): void
scalarSync(query: string, parameters?: object | array): result</code></pre>
```
