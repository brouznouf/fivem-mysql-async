---
id: 51
---

## GUI & Dev

With administration rights on your server, if you are unsure how to get those check the
[step-by-step guide on setting up FXServer](https://docs.fivem.net/docs/server-manual/setting-up-a-server/),
you can type in the command `mysql` into the console to open the GUI. You can open that console via the <kbd>F8</kbd> key.
It should show you a concise summary of how your server is doing.

The first tab shows you a time-resolved graph showing how long the queries took time in a five minute interval.
As a general rule of thumb the server should not spend more than 300,000ms querying the database. It could become especially problematic
if the amount of queries is at that point lower than 6,000, at which point your queries are likely too slow and
are in need of optimization.

The second tab shows you the same as the first tab, but instead of the queries being time-resolved they are resolved by the resources
which trigger them. So you can see which resources ask for the largest amount of database time.

The last slow query tab lists the 21 slowest queries. If they are all below the max-limit in [table for MySQL servers](#setup),
then there is no need to panic, it might be database and not a query related issue.
