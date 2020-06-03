<template>
  <v-container>
    <h1 class="headline font-weight-medium" id="setup">Setup</h1>
    <p>To Install mysql-async your first need to have installed a MySQL Database.</p>

    <h2 class="title">Database Options</h2>
    <p>Included in the table are the benchmark results of 1,000,000 inserts, with 20 done per server tick, that should mean it is about 100 inserts per second.</p>
    <mysql-table />

    <h2 class="title mt-1">Installing the Resource</h2>
    <p>
      After you have installed a database, you will have to add the resource to the server.
      To do this, first <a href="https://github.com/brouznouf/fivem-mysql-async/releases" target="_blank">download</a>
      the <em>Source Code (zip)</em> then extract the contents to the /resources/ folder of your server configuration.
    </p>
    <p>
      To learn more about configuring your server follow this
      <a href="https://docs.fivem.net/docs/server-manual/setting-up-a-server/" target="_blank">Link</a>
      to the FiveM Documentation about the step-by-step guide on setting up FXServer.
    </p>
    <p>
      After the resource has been extracted you will need to add 
      <code>ensure mysql-async</code> to your server configuration, and proceed with configuring the resource.
    </p>
  </v-container>
</template>

<script>
import MysqlTable from './MySQLTable.vue';

export default {
  components: {
    MysqlTable,
  },
}
</script>
