import { TransactionQueries, TransactionQuery } from '../mysql/transactionQueries';
import convertTransactionLegacyQueries from './convertTransactionLegacyQueries';
import queryStorage from '../queryStore';

function sanitizeTransactionInput(querys, params, callback: any): [TransactionQueries, any] {
  let sqls: TransactionQueries = [];
  let cb = callback;
  // start by type-checking and sorting the data
  const values = (typeof params === 'function') ? [] : params;
  sqls = querys.map((query: string | number | TransactionQuery) => {
    if (typeof query === 'string' || typeof query === 'number') {
      return { query: queryStorage.get(query), values };
    } // we got a Type: TransactionQuery, should actually check that, but we don't
    return { query: queryStorage.get(query.query), values: query.values };
  });
  if (typeof params === 'function') cb = params;
  sqls = convertTransactionLegacyQueries(sqls);
  return [sqls, cb];
}

export default sanitizeTransactionInput;
