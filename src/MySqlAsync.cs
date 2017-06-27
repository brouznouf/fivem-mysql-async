using CitizenFX.Core;
using CitizenFX.Core.Native;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Data;
using System.Data.Common;
using System.Diagnostics;
using MySql.Data.MySqlClient;

namespace MySqlAsync
{
    public class MySqlAsync : BaseScript
    {
        internal MySqlConnectionStringBuilder ConnectionStringBuilder;

        internal Dictionary<int, QueryProcess> CallbackRegistry = new Dictionary<int, QueryProcess>();

        public MySqlAsync()
        {
            Exports.Add("mysql_configure", new Action(() => {
                Configure(Function.Call<string>(Hash.GET_CONVAR, "mysql_connection_string"));
            }));

            Exports.Add("mysql_execute", new Action<string, IDictionary<string, object>, CallbackDelegate>((query, parameters, callback) => {
                ExecuteNonQuery(query, parameters, callback);
            }));

            Exports.Add("mysql_sync_execute", new Func<string, IDictionary<string, object>, int>((query, parameters) => {
                return ExecuteNonQuery(query, parameters);
            }));

            Exports.Add("mysql_fetch_all", new Action<string, IDictionary<string, object>, CallbackDelegate>((query, parameters, callback) => {
                ExecuteReader(query, parameters, callback);
            }));

            Exports.Add("mysql_sync_fetch_all", new Func<string, IDictionary<string, object>, List<Dictionary<string, Object>>>((query, parameters) => {
                return ExecuteReader(query, parameters);
            }));

            Exports.Add("mysql_fetch_scalar", new Action<string, IDictionary<string, object>, CallbackDelegate>((query, parameters, callback) => {
                ExecuteScalar(query, parameters, callback);
            }));

            Exports.Add("mysql_sync_fetch_scalar", new Func<string, IDictionary<string, object>, Object>((query, parameters) => {
                return ExecuteScalar(query, parameters);
            }));

            EventHandlers["onMySqlQueryExecute"] += new Action<int, bool>((key, error) => {
                CallbackRegistry[key].Call<int, int>(error, (result) => {
                    return result;
                });
            });

            EventHandlers["onMySqlQueryFetchAll"] += new Action<int, bool>((key, error) => {
                CallbackRegistry[key].Call<DbDataReader, List<Dictionary<string, Object>>>(error, (reader) => {
                    return ReaderToDictionary(reader);
                });
            });

            EventHandlers["onMySqlQueryFetchScalar"] += new Action<int, bool>((key, error) => {
                CallbackRegistry[key].Call<Object, Object>(error, (result) => {
                    return result;
                });
            });
        }

        private void Configure(string connectionString)
        {
            ConnectionStringBuilder = new MySqlConnectionStringBuilder(connectionString);
            ConnectionStringBuilder.AllowUserVariables = true;
            ConnectionStringBuilder.Pooling = false;
        }

        private MySqlConnection CreateConnection()
        {
            MySqlConnection connection = new MySqlConnection(ConnectionStringBuilder.ToString());

            try {
                connection.Open();
            } catch (Exception error) {
                CitizenFX.Core.Debug.Write(string.Format("An error happens when opening MySQL connection {0}\n", error.Message));
            }

            return connection;
        }

        private void ExecuteNonQuery(string query, IDictionary<string, object> parameters, CallbackDelegate callback)
        {
            MySqlCommand command = CreateCommand(query, parameters);

            PrepareCallback(((MySqlConnection)command.Connection).ServerThread, "onMySqlQueryExecute", new QueryProcess(command, command.ExecuteNonQueryAsync(), callback));
        }

        private int ExecuteNonQuery(string query, IDictionary<string, object> parameters)
        {
            MySqlCommand command = CreateCommand(query, parameters);
            Stopwatch stopwatch = new Stopwatch();
            int result;

            try {
                result = command.ExecuteNonQuery();
            } catch (Exception error) {
                CitizenFX.Core.Debug.Write(string.Format("[{0}ms] An error happens when executing {1} : {2}\n", stopwatch.ElapsedMilliseconds, command.CommandText, error.Message));
                command.Connection.Close();

                throw error;
            }

            stopwatch.Stop();
            command.Connection.Close();
            Console.WriteLine(string.Format("[{0}ms] {1}", stopwatch.ElapsedMilliseconds, command.CommandText));

            return result;
        }

        private void ExecuteReader(string query, IDictionary<string, object> parameters, CallbackDelegate callback)
        {
            MySqlCommand command = CreateCommand(query, parameters);

            PrepareCallback(((MySqlConnection)command.Connection).ServerThread, "onMySqlQueryFetchAll", new QueryProcess(command, command.ExecuteReaderAsync(), callback));
        }

        private List<Dictionary<string, Object>> ExecuteReader(string query, IDictionary<string, object> parameters)
        {
            MySqlCommand command = CreateCommand(query, parameters);
            Stopwatch stopwatch = new Stopwatch();
            List<Dictionary<string, Object>> result;

            try {
                result = ReaderToDictionary(command.ExecuteReader());
            } catch (Exception error) {
                CitizenFX.Core.Debug.Write(string.Format("[{0}ms] An error happens when executing {1} : {2}\n", stopwatch.ElapsedMilliseconds, command.CommandText, error.Message));
                command.Connection.Close();

                throw error;
            }

            stopwatch.Stop();
            command.Connection.Close();
            Console.WriteLine(string.Format("[{0}ms] {1}", stopwatch.ElapsedMilliseconds, command.CommandText));

            return result;
        }

        private void ExecuteScalar(string query, IDictionary<string, object> parameters, CallbackDelegate callback)
        {
            MySqlCommand command = CreateCommand(query, parameters);

            PrepareCallback(((MySqlConnection)command.Connection).ServerThread, "onMySqlQueryFetchScalar", new QueryProcess(command, command.ExecuteScalarAsync(), callback));
        }

        private Object ExecuteScalar(string query, IDictionary<string, object> parameters)
        {
            MySqlCommand command = CreateCommand(query, parameters);
            Stopwatch stopwatch = new Stopwatch();
            Object result;

            try {
                result = command.ExecuteScalar();
            } catch (Exception error) {
                CitizenFX.Core.Debug.Write(string.Format("[{0}ms] An error happens when executing {1} : {2}\n", stopwatch.ElapsedMilliseconds, command.CommandText, error.Message));
                command.Connection.Close();

                throw error;
            }

            stopwatch.Stop();
            command.Connection.Close();
            Console.WriteLine(string.Format("[{0}ms] {1}", stopwatch.ElapsedMilliseconds, command.CommandText));

            return result;
        }

        private void PrepareCallback(int key, string eventName, QueryProcess process)
        {
            CallbackRegistry.Add(
                key,
                process
            );

            process.task.ContinueWith((task2) => {
                TriggerEvent(eventName, key, false);
            }, TaskContinuationOptions.OnlyOnRanToCompletion);

            process.task.ContinueWith((task2) => {
                TriggerEvent(eventName, key, true);
            }, TaskContinuationOptions.OnlyOnFaulted);
        }

        private MySqlCommand CreateCommand(string query, IDictionary<string, object> parameters)
        {
            MySqlCommand command = (MySqlCommand) CreateConnection().CreateCommand();
            command.CommandText = query;

            foreach (var parameter in parameters ?? Enumerable.Empty<KeyValuePair<string, object>>()) {
                command.Parameters.AddWithValue(parameter.Key, parameter.Value);
            }

            return command;
        }

        private List<Dictionary<string, Object>> ReaderToDictionary(DbDataReader reader)
        {
            List<Dictionary<string, Object>> results = new List<Dictionary<string, Object>>();

            while (reader.Read()) {
                Dictionary<string, Object> line = new Dictionary<string, Object>();

                for (int i=0; i < reader.FieldCount; i++) {
                    if (reader.IsDBNull(i)) {
                        line.Add(reader.GetName(i), null);
                    } else {
                        line.Add(reader.GetName(i), reader.GetValue(i));
                    }
                }

                results.Add(line);
            }

            reader.Close();

            return results;
        }
    }

    internal class QueryProcess
    {
        internal MySqlCommand command;

        internal Task task;

        internal CallbackDelegate callback;

        internal Stopwatch stopwatch = new Stopwatch();

        public QueryProcess(MySqlCommand command, Task task, CallbackDelegate callback)
        {
            this.command = command;
            this.task = task;
            this.callback = callback;
            stopwatch.Start();
        }

        public QueryProcess(MySqlCommand command, Task task)
        {
            this.command = command;
            this.task = task;
            stopwatch.Start();
        }

        public void Call<TParam, TResult>(bool error, Func<TParam, TResult> transform)
        {
            stopwatch.Stop();

            if (error) {
                CitizenFX.Core.Debug.Write(string.Format("[{0}ms] An error happens when executing {1}\n", stopwatch.ElapsedMilliseconds, command.CommandText));
                command.Connection.Close();

                throw task.Exception;
            }

            TResult result = transform(((Task<TParam>)task).GetAwaiter().GetResult());
            command.Connection.Close();

            Console.WriteLine(string.Format("[{0}ms] {1}", stopwatch.ElapsedMilliseconds, command.CommandText));

            callback.Invoke(result);
        }
    }
}
