using CitizenFX.Core;
using CitizenFX.Core.Native;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySQLAsync
{
    abstract class Operation<TResult>
    {
        internal string ConnectionString;

        public Operation(string connectionString)
        {
            this.ConnectionString = connectionString;
        }

        public TResult Execute(string query, IDictionary<string, object> parameters = null, CallbackDelegate callback = null, bool debug = false)
        {
            TResult result = default(TResult);
            Stopwatch stopwatch = new Stopwatch();

            try
            {
                if (debug)
                {
                    stopwatch.Start();
                }

                using (var connection = new MySqlConnection(ConnectionString))
                {
                    connection.Open();

                    using (var command = CreateCommand(query, parameters, connection))
                    {
                        result = Reader(command);

                        if (debug)
                        {
                            stopwatch.Stop();
                            // @TODO Function.Call<string>(Hash.GET_INVOKING_RESOURCE)
                            Console.WriteLine(string.Format("[{0}] [{1}ms] {2}", "", stopwatch.ElapsedMilliseconds, command.CommandText));
                        }

                        if (callback != null)
                        {
                            callback.Invoke(result);
                        }
                    }
                }
            }
            catch (AggregateException aggregateException)
            {
                var firstException = aggregateException.InnerExceptions.First();

                if (!(firstException is MySqlException))
                {
                    throw aggregateException;
                }

                // @TODO Function.Call<string>(Hash.GET_INVOKING_RESOURCE)
                CitizenFX.Core.Debug.Write(string.Format("[ERROR] [{0}] An error happens on MySQL : {1}\n", "", firstException.Message));
            }
            catch (MySqlException mysqlException)
            {
                // @TODO Function.Call<string>(Hash.GET_INVOKING_RESOURCE)
                CitizenFX.Core.Debug.Write(string.Format("[ERROR] [{0}] An error happens on MySQL : {1}\n", "", mysqlException.Message));
            }

            return result;
        }

        public async Task<TResult> ExecuteAsync(string query, IDictionary<string, object> parameters = null, CallbackDelegate callback = null, bool debug = false)
        {
            TResult result = default(TResult);
            Stopwatch stopwatch = new Stopwatch();

            try
            {
                if (debug)
                {
                    stopwatch.Start();
                }

                using (var connection = new MySqlConnection(ConnectionString))
                {
                    await connection.OpenAsync();

                    using (var command = CreateCommand(query, parameters, connection))
                    {
                        result = await ReaderAsync(command);

                        if (debug)
                        {
                            stopwatch.Stop();
                            Console.WriteLine(string.Format("[{0}ms] {1}", stopwatch.ElapsedMilliseconds, command.CommandText));
                        }

                        if (callback != null)
                        {
                            callback.Invoke(result);
                        }
                    }
                }
            }
            catch (AggregateException aggregateException)
            {
                var firstException = aggregateException.InnerExceptions.First();

                if (!(firstException is MySqlException))
                {
                    throw aggregateException;
                }

                CitizenFX.Core.Debug.Write(string.Format("An error happens on MySQL : {0}\n", firstException.Message));
            }
            catch (MySqlException mysqlException)
            {
                CitizenFX.Core.Debug.Write(string.Format("An error happens on MySQL : {0}\n", mysqlException.Message));
            }

            return result;
        }

        abstract protected TResult Reader(MySqlCommand command);

        abstract protected Task<TResult> ReaderAsync(MySqlCommand command);

        private MySqlCommand CreateCommand(string query, IDictionary<string, object> parameters, MySqlConnection connection)
        {
            MySqlCommand command = (MySqlCommand)connection.CreateCommand();
            command.CommandText = query;

            foreach (var parameter in parameters ?? Enumerable.Empty<KeyValuePair<string, object>>())
            {
                command.Parameters.AddWithValue(parameter.Key, parameter.Value);
            }

            return command;
        }
    }
}
