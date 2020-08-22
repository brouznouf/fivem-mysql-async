<template>
  <div>
    <h3 class="mt-3">Settings</h3>
    <p>
      General settings on how you want to configure your FXServer.<br />Be careful, if you go back to any previous step, nothing set on this page
      will be remembered.
    </p>
    <b-form-checkbox
      v-model="useConnectionString"
      :value="true"
      :unchecked-value="false"
    >
      Use a server variable to connect in the <code>server.cfg</code> instead of the <code>config.json</code>
    </b-form-checkbox>

    <b-form-checkbox
      :disabled="!useConnectionString"
      v-model="generateURLConnectionString"
      :value="true"
      :unchecked-value="false"
    >
      Use a connection string that is URL-style instead of semicolon-seperated.
    </b-form-checkbox>

    <h3 class="mt-3">General Options</h3>
    <p>This section contains the actual configuration of the server.</p>

    <table class="table b-table">
      <tbody>
        <tr>
          <td><strong>Debug Information</strong><br />Controls where debug output should go.</td>
          <td><b-form-select v-model="mysqlDebug" :options="optionsDebug" /></td>
        </tr>
        <tr>
          <td><strong>Slow Query Warning</strong><br />Sets a time in milliseconds after which a warning will be issued for a slow performing query.</td>
          <td><b-form-input v-model="mysqlSlowQuery" type="number" /></td>
        </tr>
        <tr>
          <td><strong>Log Level</strong><br />Controls what type of information should go to Console</td>
          <td>
            <b-form-checkbox v-model="mysqlLogLevelArray[0]" :value="1" :unchecked-value="0">Success</b-form-checkbox>
            <b-form-checkbox v-model="mysqlLogLevelArray[1]" :value="2" :unchecked-value="0">Info</b-form-checkbox>
            <b-form-checkbox v-model="mysqlLogLevelArray[2]" :value="4" :unchecked-value="0">Warning</b-form-checkbox>
            <b-form-checkbox v-model="mysqlLogLevelArray[3]" :value="8" :unchecked-value="0">Error</b-form-checkbox>
          </td>
        </tr>
        <tr>
          <td><strong>Log File Format</strong><br />Sets a format of the generated log file on server start. Can be used to log to a subdirectory.</td>
          <td><b-form-input :disabled="this.mysqlDebug !== 'File' && this.mysqlDebug !== 'FileAndConsole'" v-model="mysqlLogFileFormat" type="text" /></td>
        </tr>
      </tbody>
    </table>

    <h3 class="mt-3">Connection Options</h3>
    <p>This are the options to configure the connection.</p>

    <p class="mt-3">Select options from this drop down you want to have configured.</p>
    <div class="d-flex">
      <b-form-select class="m-2" v-model="currentOption" :options="connectionOptionsSelectable" />
      <b-button class="m-2" variant="primary" @click="addCurrentOption()">Add</b-button>
    </div>

    <p>Fill in the values in this table below, or remove the options you do not want to use.</p>
    <table class="table b-table">
      <tbody>
        <tr v-for="(option, index) in connectionOptionsSelected" :key="option.name">
          <td><strong>{{ option.name }}</strong></td>
          <td>
            <b-form-input v-if="option.type !== 'boolean'" v-model="connectionOptionValues[index]" :type="option.type" />
            <b-form-checkbox v-if="option.type === 'boolean'" v-model="connectionOptionValues[index]" :value="true" :unchecked-value="false" />
          </td>
          <td>
            <b-button variant="outline-danger" @click="removeOption(index)">Remove</b-button>
          </td>
        </tr>
      </tbody>
    </table>

    <h3>FXServer Configuration</h3>
    Add the following text to your <code>server.cfg</code>, at best above all other <code>ensure</code> lines.
    <b-form-textarea class="border border-dark p-2 mt-2" :rows="8" plaintext :value="serverCfg.trim()" />

    <div v-if="!useConnectionString" class="mt-3">
      <p>And then download and paste the <code>config.json</code> in the <em>mysql-async</em> folder with the one
      from the following link:</p>
      <b-button
        :href="`data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(downloadConfig))}`"
        download="config.json"
        class="mt-2" 
        variant="outline-primary"
      >
        Download
      </b-button>
    </div>

    <p class="mt-2 p-2 font-weight-bold">Congratulations, you have successfully setup <em>mysql-async</em> to work with the FiveM server.</p>
  </div>  
</template>

<script>
import { BButton, BFormCheckbox, BFormInput, BFormSelect, BFormTextarea, } from 'bootstrap-vue';
export default {
  components: {
    BButton,
    BFormCheckbox,
    BFormInput,
    BFormSelect,
    BFormTextarea,
  },
  data() {
    return {
      useConnectionString: true,
      generateURLConnectionString: false,
      mysqlDebug: 'None',
      mysqlSlowQuery: 150,
      mysqlLogFileFormat: '%s-%d.log',
      mysqlLogLevelArray: [1, 2, 4, 8],
      optionsDebug: [
        { text: 'Show only Errors, Warnings and Info', value: 'None', },
        { text: 'Display Queries in Server Console', value: 'Console', },
        { text: 'Print Queries to File', value: 'File', },
        { text: 'Print Queries to File and display in Server Console', value: 'FileAndConsole', },
      ],
      connectionOptionsAvailable: [
        { name: 'host', type: 'text', default: 'localhost', required: false, not: ['socketPath'], },
        { name: 'port', type: 'number', default: 3306, required: false, not: ['socketPath'], },
        { name: 'localAddress', type: 'text', required: false, },
        { name: 'socketPath', type: 'text', required: false, not: ['host', 'port'], },
        { name: 'user', type: 'text', required: true, },
        { name: 'password', type: 'text', required: false, },
        { name: 'database', type: 'text', required: true, },
        { name: 'charset', type: 'text', default: 'utf8_general_ci', required: false, },
        { name: 'timezone', type: 'text', default: 'local', required: false, },
        { name: 'connectTimeout', type: 'number', default: 10000, required: false, },
        { name: 'stringifyObjects', type: 'boolean', default: false, required: false, },
        { name: 'insecureAuth', type: 'boolean', default: false, required: false, },
        { name: 'supportBigNumbers', type: 'boolean', default: false, required: false, },
        { name: 'bigNumberStrings', type: 'boolean', default: false, required: false, only: ['supportBigNumbers'], },
        { name: 'debug', type: 'boolean', default: false, required: false, },
        { name: 'trace', type: 'boolean', default: true, required: false, },
        { name: 'localInfile', type: 'boolean', default: true, required: false, },
        { name: 'multipleStatements', type: 'boolean', default: false, required: false, },
        { name: 'acquireTimeout', type: 'number', default: 10000, required: false, },
        { name: 'waitForConnections', type: 'boolean', default: true, required: false, },
        { name: 'connectionLimit', type: 'number', default: 10, required: false, },
        { name: 'queueLimit', type: 'number', default: 0, required: false, },
      ],
      connectionOptionsSelected: [],
      connectionOptionValues: [],
      currentOption: 'host',
    }
  },
  computed: {
    connectionOptionsSelectable() {
      return this.connectionOptionsAvailable.filter((opt) => {
        let passing = true;
        if (opt.not) passing = !opt.not.some((o) => this.connectionOptionsSelected.findIndex((s) => s.name === o) !== -1)
        if (passing && opt.only) passing = opt.only.every((o) => this.connectionOptionsSelected.findIndex((s) => s.name === o) !== -1)
        if (passing) passing = (this.connectionOptionsSelected.findIndex((s) => s.name === opt.name) === -1);
        return passing;
      }).map((opt) => ({ text: opt.name, value: opt.name }));
    },
    connectionOptions() {
      return this.connectionOptionsSelected.map((opt, index) => ({ 
        default: (opt.default) ? opt.default : null,
        value: this.connectionOptionValues[index],
        name: opt.name,
      }));
    },
    mysqlLogLevel() {
      return this.mysqlLogLevelArray.reduce((acc, cur) => acc + cur, 0);
    },
    downloadConfig() {
      return this.connectionOptions.reduce((acc, cur) => {
        let value = (cur.value === null) ? '' : cur.value;
        if (typeof value === 'string') {
          if (!isNaN(parseInt(value))) value = Number(value);
        }
        acc[cur.name] = value;
        return acc;
      }, {});
    },
    mysqlConnectionString() {
      if (!this.useConnectionString) return '';
      if (this.generateURLConnectionString) {
        const user = this.connectionOptions.find((opt) => opt.name === 'user');
        const userName = user.value || 'root';
        let pwd = null;
        const idxPwd = this.connectionOptions.findIndex((opt) => opt.name === 'password');
        if (idxPwd !== -1) pwd = this.connectionOptions[idxPwd].value;
        const pwdPart = (pwd !== null) ? `:${pwd}` : '';
        let host = 'localhost';
        const idxHost = this.connectionOptions.findIndex((opt) => opt.name === 'host');
        if (idxHost !== -1) host = this.connectionOptions[idxHost].value;
        let port = null;
        const idxPort = this.connectionOptions.findIndex((opt) => opt.name === 'port');
        if (idxPort !== -1) port = this.connectionOptions[idxPort].value;
        const portPart = (port !== null) ? `:${port}` : '';
        const opts = this.connectionOptions.reduce((acc, cur) => {
          if (['host', 'port', 'user', 'password', 'database'].includes(cur.name)) return acc;
          return `${acc}&${cur.name}=${cur.value || ''}`;
        }, '').substr(1);
        const db = this.connectionOptions.find((opt) => opt.name === 'database');
        const database = db.value;
        return `mysql://${userName}${pwdPart}@${host}${portPart}/${database}?${opts}`;
      }
      return this.connectionOptions.reduce((acc, cur) => {
        if (cur.default !== null && cur.value == cur.default) return acc;
        return `${acc};${cur.name}=${cur.value || ''}`;
      }, '').substr(1);
    },
    serverCfg() {
      let retString = '';
      if (this.useConnectionString) retString += `set mysql_connection_string "${this.mysqlConnectionString}"\n`;
      if (this.mysqlDebug !== 'None') retString += `set mysql_debug "${this.mysqlDebug}"\n`;
      if (this.mysqlSlowQuery != 150) retString += `set mysql_slow_query_warning ${this.mysqlSlowQuery}\n`;
      if (this.mysqlLogLevel !== 15) retString += `set mysql_log_level ${this.mysqlLogLevel}\n`;
      if (this.mysqlLogFileFormat !== '%s-%d.log') retString += `set mysql_log_file_format "${this.mysqlLogFileFormat}"\n`;
      retString += `\nensure mysql-async\n`;
      return retString;
    },
  },
  methods: {
    required() {
      this.connectionOptionsAvailable.forEach((opt) => {
        if (opt.required && this.connectionOptionsSelected.findIndex((s) => s.name === opt.name) === -1) {
          this.addOptions(opt);
        }
      });
    },
    addOptions(opt) {
      this.connectionOptionsSelected.push(opt);
      this.connectionOptionValues.push(opt.default || null);
    },
    addCurrentOption() {
      this.addOptions(this.connectionOptionsAvailable.find((opt) => opt.name === this.currentOption));
    },
    removeOption(index) {
      this.connectionOptionValues.splice(index, 1)
      this.connectionOptionsSelected.splice(index, 1)
    },
  },
  watch: {
    connectionOptionsSelected() {
      this.required();
    },
  },
  mounted() {
    this.required();
  },
}
</script>
