<template>
  <v-container>
    <h1 class="headline font-weight-medium" id="guidev">GUI &amp; Dev</h1>

    <p>
      With administration rights on your server, if you are unsure how to get those check the
      <a href="https://docs.fivem.net/docs/server-manual/setting-up-a-server/" target="_blank">step-by-step guide on setting up FXServer</a>,
      you can type in the command <code>mysql</code> into the console to open the GUI. You can open that console via the <kbd>F8</kbd> key.
      It should show you a concise summary of how your server is doing.
    </p>
    <p>
      The first tab shows you a time-resolved graph showing how long the queries took time in a five minute interval.
      As a general rule of thumb the server should not spend more than 300,000ms querying the database.
      It could become especially problematic if the amount of queries is at that point lower than 6,000,
      at which point your queries are likely too slow and are in need of optimization.
    </p>
    <p>
      The second tab shows you the same as the first tab, but instead of the queries being time-resolved they are resolved
      by the resources which trigger them. So you can see which resources ask for the largest amount of database time.
    </p>
    <p>
      The last slow query tab lists the 21 slowest queries. If they are all below the max-limit in <a href="#setup">table for MySQL servers</a>,
      then there is no need to panic, it might be database and not a query related issue.
    </p>

    <v-img :src="require('../assets/gui.webp').default" />

    <h2 class="title">Toggle Debug Print</h2>
    <p>
      Given you have admin rights, you can use the command <code>mysql:debug</code> which flips interally the value for
      <code>mysql_debug</code> to <code>1</code> or <code>0</code>, so it enables you to turn on the debug prints to the
      console or a file, or both given your settings for <code>mysql_debug_output</code>.
    </p>
  </v-container>
</template>

<script>
export default {}
</script>
