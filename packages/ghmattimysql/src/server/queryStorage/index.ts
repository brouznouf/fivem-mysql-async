/*
 * Creates a query string storage,
 * to reduce the impact of resending longer
 * query strings again and again through export
 * which can effect the fxservers performance
 */

class QueryStringStorage {
  queryStringStorage: string[];

  constructor() {
    this.queryStringStorage = [];
  }

  add(query: string): number {
    const index = this.queryStringStorage.indexOf(query);
    if (index === -1) return this.queryStringStorage.push(query) - 1;
    return index;
  }

  get(query: string | number): string {
    if (typeof query === 'number') return this.find(query);
    return query;
  }

  find(storageId: number): string {
    if (this.queryStringStorage.length > storageId) return this.queryStringStorage[storageId];
    return 'Error: Query string not found in storage';
  }
}

export default QueryStringStorage;
