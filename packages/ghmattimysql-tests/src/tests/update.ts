import Test from './test';
import { testTable } from './constants';

function updateResult(affectedRows = 1, changedRows = 1) {
  return {
    fieldCount: 0,
    affectedRows,
    insertId: 0,
    serverStatus: 2,
    warningCount: 0,
    message: `(Rows matched: ${affectedRows}  Changed: ${changedRows}  Warnings: 0`,
    protocol41: true,
    changedRows
  };
}

class Update extends Test {
  constructor() {
    super('Update');
  }

  async run() {
    const updateObject = new Promise((resolve) => {
      global.exports.ghmattimysql.execute('UPDATE ?? SET ? WHERE ?', [testTable, { online: false, cash: 500 }, { identifier: 9 }], (result) => {
        resolve(result);
      });
    });
    this.assert(updateResult(), await updateObject, 'UPDATE-SET-OBJECT');    
  }
};

const update = new Update();
export default update;
