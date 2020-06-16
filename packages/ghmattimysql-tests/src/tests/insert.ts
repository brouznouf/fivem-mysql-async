import Test from './test';
import { testTable } from './constants';

function insertResult(insertId = 1, affectedRows = 1, message = "") {
  return {
    fieldCount: 0,
    affectedRows,
    insertId,
    serverStatus: 2,
    warningCount: 0,
    message,
    protocol41: true,
    changedRows: 0
  };
}

class Insert extends Test {
  constructor() {
    super('Insert');
  }

  async run() {
    const insertObject = new Promise((resolve) => {
      global.exports.ghmattimysql.execute('INSERT INTO ?? SET ?', [testTable, { online: true, identifier: 9 }], (result) => {
        resolve(result);
      });
    });
    this.assert(insertResult(), await insertObject, 'INSERT-SET-OBJECT');

    const insertMultiRow = new Promise((resolve) => {
      global.exports.ghmattimysql.execute('INSERT INTO ?? (??) VALUES ?', [testTable, ['online', 'identifier'], [
        [true, 12],
        [true, 15],
        [false, 19],
        [false, 23],
        [true, 24],
        [false, 26],
      ]], (result) => {
        resolve(result);
      });
    });
    this.assert(insertResult(2, 6, "&Records: 6  Duplicates: 0  Warnings: 0"), await insertMultiRow, 'INSERT-VALUES-MULTIROW');

    const insertLegacy = new Promise((resolve) => {
      global.exports.ghmattimysql.execute(`INSERT INTO ${testTable} (online, identifier) VALUES (@online, @identifier)`, { online: true, identifier: 29 }, (result) => {
        resolve(result);
      });
    });
    this.assert(insertResult(8), await insertLegacy, 'INSERT-VALUES-LEGACY');
    
  }
};

const insert = new Insert();
export default insert;
