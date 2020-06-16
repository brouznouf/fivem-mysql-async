import { isEqual } from 'lodash';

class Test {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  assert(expected: any, result: any, shard: string) {
    this.log(isEqual(expected, result), shard);
  }

  log(success: boolean, shard: string) {
    let color = '\x1b[31m';
    let state = 'FAILED';
    if (success) {
      color = '\x1b[32m';
      state = 'PASSED';
    }
    console.log(`${color}[test:${this.name}]\x1b[0m ${state}: ${shard}`);
  }
}

export default Test;
