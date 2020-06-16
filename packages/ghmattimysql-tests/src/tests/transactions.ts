import Test from './test';
import { testTable } from './constants';

class Transaction extends Test {
  constructor() {
    super('Transaction');
  }

  async run() {
    const transactionLegacy = new Promise((resolve) => {
      global.exports.ghmattimysql.transaction([
        `UPDATE ${testTable} SET cash = @cash1 WHERE identifier = @idA`,
        `UPDATE ${testTable} SET cash = @cash2 WHERE identifier = @idB`,
      ], { idA: 12, idB: 15, cash1: 100, cash2: 1000 }, (result) => {
        resolve(result);
      });
    });
    this.assert(true, await transactionLegacy, 'TRANSACTION-LEGACY');

    const transactionJS = new Promise((resolve) => {
      global.exports.ghmattimysql.transaction([
        {
          query: 'UPDATE ?? SET ? WHERE ?',
          values: [testTable, { cash: 500 }, { identifier: 19 }],
        },
        {
          query: 'UPDATE ?? SET ? WHERE ?',
          values: [testTable, { cash: 5000 }, { identifier: 23 }],
        },
      ], (result) => {
        resolve(result);
      });
    });
    this.assert(true, await transactionJS, 'TRANSACTION-JS-SYNTAX');

    const transactionError = new Promise((resolve) => {
      global.exports.ghmattimysql.transaction([
        `UPDATE ${testTable} SET cash = @cash1 WHERE identifier = @idA`,
        `UPDATE ${testTable} SET cash = @cash2 WHERE identifier = @idB`,
      ], { idA: 12, idB: 15, cash1: 200, cash2: -1000 }, (result) => {
        resolve(result);
      });
    });
    this.assert(false, await transactionError, 'TRANSACTION-ERROR');
  }
};

const transaction = new Transaction();
export default transaction;
