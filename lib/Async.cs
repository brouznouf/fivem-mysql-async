using System;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using System.Data.Common;
using MySql.Data.MySqlClient;

namespace Brouznouf.FiveM
{
    public class Async
    {
        public static void ExecuteCallback(Task<int> task, Delegate callback)
        {
            doCallback<int>(task, callback);
        }

        public static void ExecuteReaderCallback(Task<DbDataReader> task, Delegate callback)
        {
            doCallback<DbDataReader>(task, callback);
        }

        public static void ExecuteScalarCallback(Task<Object> task, Delegate callback)
        {
            doCallback<Object>(task, callback);
        }

        public static void BeginTransactionCallback(Task<MySqlTransaction> task, Delegate callback)
        {
            doCallback<MySqlTransaction>(task, callback);
        }

        public static void CommitTransactionCallback(Task task, Delegate callback)
        {
            doCallback(task, callback);
        }

        public static void RollbackTransactionCallback(Task task, Delegate callback)
        {
            doCallback(task, callback);
        }

        private static void doCallback<T>(Task<T> task, Delegate callback)
        {
            task.ContinueWith((task2) => {
                callback.DynamicInvoke(task.GetAwaiter().GetResult(), null);
            }, TaskContinuationOptions.OnlyOnRanToCompletion);

            task.ContinueWith((task2) => {
                callback.DynamicInvoke(null, task.Exception);
            }, TaskContinuationOptions.OnlyOnFaulted);
        }

        private static void doCallback(Task task, Delegate callback)
        {
            task.ContinueWith((task2) => {
                callback.DynamicInvoke(true, null);
            }, TaskContinuationOptions.OnlyOnRanToCompletion);

            task.ContinueWith((task2) => {
                callback.DynamicInvoke(false, task.Exception);
            }, TaskContinuationOptions.OnlyOnFaulted);
        }
    }
}