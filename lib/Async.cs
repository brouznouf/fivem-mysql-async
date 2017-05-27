using System;
using System.Runtime.CompilerServices;
using System.Data.Common;

namespace Brouznouf.FiveM
{
    public class Async
    {
        public static void ExecuteCallback(TaskAwaiter<int> awaiter, Delegate f)
        {
            awaiter.OnCompleted(() => f.DynamicInvoke(awaiter.GetResult()));
        }

        public static void FetchAllCallback(TaskAwaiter<DbDataReader> awaiter, Delegate f)
        {
            awaiter.OnCompleted(() => f.DynamicInvoke(awaiter.GetResult()));
        }
    }
}