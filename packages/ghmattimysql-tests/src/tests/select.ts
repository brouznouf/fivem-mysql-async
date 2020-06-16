import Test from './test';
import { testTable } from './constants';

class Select extends Test {
  constructor() {
    super('Select');
  }

  async run() {
    const selectEmpty = new Promise((resolve) => {
      global.exports.ghmattimysql.execute('SELECT * FROM ?? WHERE ?', [testTable, { identifier: 50000001 }], (result) => {
        resolve(result);
      });
    });
    this.assert([], await selectEmpty, 'SELECT-EMPTY');

    const selectOne = new Promise((resolve) => {
      global.exports.ghmattimysql.execute('SELECT 1 as one', (result) => {
        resolve(result);
      });
    });
    this.assert([{ one: 1 }], await selectOne, 'SELECT-AS');

    const selectScalar = new Promise((resolve) => {
      global.exports.ghmattimysql.scalar('SELECT 1 as one', (result) => {
        resolve(result);
      });
    });
    this.assert(1, await selectScalar, 'SELECT-SCALAR');

    const selectScalarNull = new Promise((resolve) => {
      global.exports.ghmattimysql.scalar('SELECT cash FROM ?? WHERE ?', [testTable, { identifier: 50000001 }], (result) => {
        resolve(result);
      });
    });
    this.assert(null, await selectScalarNull, 'SELECT-SCALAR-NULL');

    const selectError = new Promise((resolve) => {
      global.exports.ghmattimysql.execute('SELECT fieldDoesNotExist FROM ?? WHERE ?', [testTable, { id: 1 }], (result) => {
        resolve(result);
      });
    });
    this.assert(null, await selectError, 'SELECT-ERROR');
  }
};

const select = new Select();
export default select;
