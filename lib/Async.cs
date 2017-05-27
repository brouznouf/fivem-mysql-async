using System;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using System.Data.Common;

namespace Brouznouf.FiveM
{
    public class Async
    {
        public static void ExecuteCallback(Task<int> task, Delegate f)
        {
            task.ContinueWith((task2) => {
                f.DynamicInvoke(task.GetAwaiter().GetResult(), null);
            }, TaskContinuationOptions.OnlyOnRanToCompletion);

            task.ContinueWith((task2) => {
                f.DynamicInvoke(null, task.Exception);
            }, TaskContinuationOptions.OnlyOnFaulted);
        }

        public static void ExecuteReaderCallback(Task<DbDataReader> task, Delegate f)
        {
            task.ContinueWith((task2) => {
                f.DynamicInvoke(task.GetAwaiter().GetResult(), null);
            }, TaskContinuationOptions.OnlyOnRanToCompletion);

            task.ContinueWith((task2) => {
                f.DynamicInvoke(null, task.Exception);
            }, TaskContinuationOptions.OnlyOnFaulted);
        }

        public static void ExecuteScalarCallback(Task<Object> task, Delegate f)
        {
            task.ContinueWith((task2) => {
                f.DynamicInvoke(task.GetAwaiter().GetResult(), null);
            }, TaskContinuationOptions.OnlyOnRanToCompletion);

            task.ContinueWith((task2) => {
                f.DynamicInvoke(null, task.Exception);
            }, TaskContinuationOptions.OnlyOnFaulted);
        }
    }
}