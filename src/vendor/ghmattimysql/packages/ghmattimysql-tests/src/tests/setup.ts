import { testTable } from './constants';

const testUsersTable = `CREATE TABLE ${testTable} (
	id BIGINT unsigned NOT NULL AUTO_INCREMENT,
  identifier BIGINT NOT NULL,
  cash INT unsigned NOT NULL DEFAULT 0,
	online BOOLEAN NOT NULL DEFAULT false,
	lastSeen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	UNIQUE KEY unique_identifier (identifier) USING BTREE,
	PRIMARY KEY (id)
);`;

function setup() {
  return new Promise((resolve, reject) => {
    global.exports.ghmattimysql.execute(testUsersTable, () => resolve());
    setTimeout(() => reject(), 20000);
  });
}

export default setup;
