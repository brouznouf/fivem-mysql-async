<template>
  <v-container>
    <h1 class="headline font-weight-medium" id="config">Configuration</h1>
    <p>
      <em>mysql-async</em> is configured by setting <code>set mysql_connection_string "[string]"</code>. The connection string can either be formatted like
      an url:
      <pre><code>set mysql_connection_string "mysql://user:password@host/database?charset=utf8mb4"</code></pre>
      Here options are chained <code>&amp;</code>. The other option is to to use an option string where each variable is seperated by an <code>;</code>,
      which would look like: <pre><code>set mysql_connection_string "database=mysqlasync;charset=utf8mb4"</code></pre>
      The configuration options available for these strings are listed below.
    </p>

    <h2 class="title">Configuration Options</h2>
    <p>
      This is taken directly from the <a href="https://github.com/mysqljs/mysql#connection-options" target="_blank">mysql.js Readme file</a>, but trimmed
      to only applicable connection and pooling options, or changed a bit to accomodate legacy settings.
    </p>
    <m-config-options />

    <h2 class="title mt-1">Additional Configuration Options</h2>
    <p>
      These additional configuration are to be set in the server configuration file, in a similar way to
      setting the <code>mysql_connection_string</code>.
    </p>
    <v-card>
      <v-card-title>mysql_debug</v-card-title>
      <v-card-subtitle>Prints out query information to a specified outlet (Default: <code>0</code>)</v-card-subtitle>
    </v-card>
    <v-card>
      <v-card-title>mysql_debug_output</v-card-title>
      <v-card-subtitle>Sets the location where to output information from <code>mysql_debug</code>.
            Possible options are <code>console</code>, <code>file</code>, and <code>both</code>.
            In case of a file output, the file will be located in the current working directory
            on starting the server, named like the resource, e.g. <code>/ghmattimysql.log</code>
            (Default: <code>console</code>)</v-card-subtitle>
    </v-card>
    <v-card>
      <v-card-title>mysql_slow_query_warning</v-card-title>
      <v-card-subtitle> Sets a limit in millisecondss, queries slower than this limit will be displayed with a warning at the specified location of
            <code>mysql_debug_output</code>, see above (Default: <code>200</code>)</v-card-subtitle>
    </v-card>
  </v-container>
</template>

<script>
import MConfigOptions from './ConfigOptions.vue';

export default {
  components: {
    MConfigOptions,
  },
}
</script>
