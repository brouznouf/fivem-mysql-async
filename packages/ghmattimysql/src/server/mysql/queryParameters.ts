interface QueryParametersLegacy {
  [parameter: string]: number | string
}

type QueryParameterOptions = string | number;
type QueryParameters = QueryParametersLegacy
  | Array<Array<Array<QueryParameterOptions>>>
  | Array<QueryParameterOptions>;

export default QueryParameters;
