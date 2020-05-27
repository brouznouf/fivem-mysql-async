import ExecutionTime from './executionTime';

interface SlowQuery {
  queryTime: number;
  resource: string;
  sql: string;
}

interface Profile {
  executionTimes: ExecutionTime[];
  resources: { [resource: string]: ExecutionTime };
  slowQueries: SlowQuery[];
}

export default Profile;
