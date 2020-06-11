import { TransactionQueries } from '../mysql/transactionQueries';
import prepareLegacyQuery from './prepareLegacyQuery';

function convertTransactionLegacyQueries(querys: TransactionQueries): TransactionQueries {
  const sqls = querys;
  sqls.forEach((element, index: number) => {
    const [query, values] = prepareLegacyQuery(element.query, element.values);
    sqls[index] = {
      query,
      values: (Array.isArray(values)) ? values : [],
    };
  });
  return sqls;
}

export default convertTransactionLegacyQueries;
