<template>
  <v-data-iterator
    :search="search"
    :items="items"
    :items-per-page.sync="items.length"
    hide-default-footer
  >
  <template v-slot:header>
    <v-toolbar
      class="mb-1"
      flat
    >
      <v-text-field
        v-model="search"
        solo
        flat
        clearable
        outlined
        hide-details
        label="Search"
      ></v-text-field>
    </v-toolbar>
  </template>

  <template v-slot:default="{ items }">
    <v-card v-for="item in items" :key="item.name">
      <v-card-title>{{ item.name }}</v-card-title>
      <v-card-subtitle>{{ item.description }} ({{ (typeof item.default !== 'undefined' && item.default !== null) ? `Default: ${item.default}` : 'Optional' }})</v-card-subtitle>
    </v-card>
  </template>

  </v-data-iterator>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      items: [
        { name: 'host | server | data source | datasource | addr | address', default: 'localhost', description: 'The hostname of the database you are connecting to.' },
        { name: 'port', default: 3306, description: 'The port number to connect to.' },
        { name: 'localAddress', description: 'The source IP address to use for TCP connection.' },
        { name: 'socketPath', description: 'The path to a unix domain socket to connect to. When used host and port are ignored.' },
        { name: 'user | user id | userid | user name | username | uid', default: 'root', description: 'The MySQL user to authenticate as.' },
        { name: 'password | pwd', default: '', description: 'The password of that MySQL user.' },
        { name: 'database | initial catalog', default: 'fivem', description: 'Name of the database to use for this connection.' },
        { name: 'charset', default: 'UTF8_GENERAL_CI', description: 'The charset for the connection. This is called "collation" in the SQL-level of MySQL (like utf8_general_ci). If a SQL-level charset is specified (like utf8mb4) then the default collation for that charset is used.' },
        { name: 'timezone', default: 'local', description: 'The timezone configured on the MySQL server. This is used to type cast server date/time values to JavaScript Date object and vice versa. This can be \'local\', \'Z\', or an offset in the form +HH:MM or -HH:MM.' },
        { name: 'connectTimeout', default: 10000, description: 'The milliseconds before a timeout occurs during the initial connection to the MySQL server.' },
        { name: 'stringifyObjects', default: false, description: 'Stringify objects instead of converting to values.' },
        { name: 'insecureAuth', default: false, description: 'Allow connecting to MySQL instances that ask for the old (insecure) authentication method.' },
        { name: 'supportBigNumbers', default: true, description: 'When dealing with big numbers (BIGINT and DECIMAL columns) in the database, you should enable this option.' },
        { name: 'bigNumberStrings', default: false, description: 'Enabling both supportBigNumbers and bigNumberStrings forces big numbers (BIGINT and DECIMAL columns) to be always returned as JavaScript String objects.' },
        { name: 'debug', default: false, description: 'Prints protocol details to stdout. Can be true/false or an array of packet type names that should be printed.' },
        { name: 'trace', default: true, description: 'Generates stack traces on Error to include call site of library entrance ("long stack traces"). Slight performance penalty for most calls.' },
        { name: 'localInfile', default: true, description: 'Allow LOAD DATA INFILE to use the LOCAL modifier.' },
        { name: 'multipleStatements', default: true, description: 'Allow multiple mysql statements per query. Be careful with this, it could increase the scope of SQL injection attacks.' },
        { name: 'flags', description: 'List of connection flags to use other than the default ones. It is also possible to blacklist default ones. For more information, check the mysql.js ReadMe for Connection Flags.' },
        { name: 'acquireTimeout', default: 10000, description: 'The milliseconds before a timeout occurs during the connection acquisition. This is slightly different from connectTimeout, because acquiring a pool connection does not always involve making a connection. If a connection request is queued, the time the request spends in the queue does not count towards this timeout.' },
        { name: 'waitForConnections', default: true, description: 'Determines the pool\'s action when no connections are available and the limit has been reached. If true, the pool will queue the connection request and call it when one becomes available. If false, the pool will immediately call back with an error.' },
        { name: 'connectionLimit', default: 10, description: 'The maximum number of connections to create at once.' },
        { name: 'queueLimit', default: 0, description: 'The maximum number of connection requests the pool will queue before returning an error from getConnection. If set to 0, there is no limit to the number of queued connection requests.' },
        { name: 'keepAlive', description: 'Sends keep alive queries, for connections to be kept alive that are unused for more than 8 hours. Set to a number in seconds, a keep-alive query should be fired.' },
      ],
    };
  },
}
</script>
