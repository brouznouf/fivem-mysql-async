import Test from './test';
import { testTable } from './constants';

class Store extends Test {
  storeSelectId: number;

  constructor() {
    super('Store');
    global.exports.ghmattimysql.store('SELECT identifier, cash, online FROM ?? WHERE ?', (storeId) => {
      this.storeSelectId = storeId;
      global.exports.ghmattimysql.store('SELECT identifier, cash, online FROM ?? WHERE ?', (noDuplicate) => {
        this.assert(this.storeSelectId, noDuplicate, 'STORE-NO-DUPLICATE');
      });
    });
  }

  async run() {
    const storeSelect = new Promise((resolve) => {
      global.exports.ghmattimysql.execute(this.storeSelectId, [testTable, { identifier: 9 }], (result) => {
        resolve(result);
      });
    });
    this.assert([{ identifier: 9, online: false, cash: 500 }], await storeSelect, 'STORE-SELECT');
  }
};

const store = new Store();
export default store;