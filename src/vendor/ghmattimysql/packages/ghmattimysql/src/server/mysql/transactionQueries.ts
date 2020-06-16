import QueryParameters from './queryParameters';

interface TransactionQuery {
  values: QueryParameters,
  query: string,
}

type TransactionQueries = Array<TransactionQuery>;

export {
  TransactionQueries,
  TransactionQuery,
};
