var MySQL = {
    Async: {},
}

function safeParameters(params) {
    if (!params) return { "": "" };
    if (typeof (params) != "object") throw new Error("A Object is expected");
    if (!Object.keys(params).length) return { "": "" };

    return params
}

/**
 * Execute a query with no result required, sync version
 * @param {String} query 
 * @param {Object} params 
 * @returns Promise (Number of rows updated)
 */
MySQL.Async.execute = (query, params) => {
    if (typeof (query) != "string" && typeof (query) != "number") throw new Error("The SQL Query must be a string")
    return new Promise((resolve, reject) => {
        exports['mysql-async'].mysql_execute(query, safeParameters(params), function (result) {
            resolve(result);
        })
    })
}

/**
 * Execute a query and fetch all results, sync version
 * @param {String} query 
 * @param {Object} params 
 * @returns Promise (Array of Query results)
 */
MySQL.Async.fetchAll = (query, params) => {
    if (typeof (query) != "string" && typeof (query) != "number") throw new Error("The SQL Query must be a string")
    return new Promise((resolve, reject) => {
        exports['mysql-async'].mysql_fetch_all(query, safeParameters(params), function (result) {
            resolve(result);
        })
    })
}

/**
 * Execute a query and fetch the first column of the first row, sync version
 * Useful for count function by example
 * @param {String} query 
 * @param {Object} params 
 * @returns Promise (mixed Value of the first column in the first row)
 */
MySQL.Async.fetchScalar = (query, params) => {
    if (typeof (query) != "string" && typeof (query) != "number") throw new Error("The SQL Query must be a string")
    return new Promise((resolve, reject) => {
        exports['mysql-async'].mysql_fetch_scalar(query, safeParameters(params), function (result) {
            resolve(result);
        })
    })
}

/**
 * Execute a query and retrieve the last id insert, sync version
 * @param {String} query 
 * @param {Object} params 
 * @returns Promise (mixed Value of the last insert id)
 */
MySQL.Async.insert = (query, params) => {
    if (typeof (query) != "string" && typeof (query) != "number") throw new Error("The SQL Query must be a string")
    return new Promise((resolve, reject) => {
        exports['mysql-async'].mysql_insert(query, safeParameters(params), function (result) {
            resolve(result);
        })
    })
}

/**
 * Stores a query for later execution
 * @param {String} query 
 * @returns Promise
 */
MySQL.Async.store = (query) => {
    if (typeof (query) != "string") throw new Error("The SQL Query must be a string")
    return new Promise((resolve, reject) => {
        exports['mysql-async'].mysql_store(query, function (result) {
            resolve(result);
        })
    })
}

/**
 * Execute a List of querys and returns bool true when all are executed successfully
 * @param {Array} querys 
 * @param {Object} params 
 * @returns Promise (bool if the transaction was successful)
 */
MySQL.Async.transaction = (querys, params) => {
    return new Promise((resolve, reject) => {
        exports['mysql-async'].mysql_transaction(querys, params, function (result) {
            resolve(result);
        })
    })
}

/**
 * Execute a query with no result required, async version
 * @param {String} query 
 * @param {Object} params 
 * @param {Function} func 
 */
MySQL.fetchAll = (query, params, func) => {
    if (typeof (query) != "string" && typeof (query) != "number") throw new Error("The SQL Query must be a string")
    exports['mysql-async'].mysql_fetch_all(query, safeParameters(params), func)
}

/**
 * Execute a query and fetch the first column of the first row, async version
 * Useful for count function by example
 * @param {String} query 
 * @param {Object} params 
 * @param {Function} func 
 */
MySQL.fetchScalar = (query, params, func) => {
    if (typeof (query) != "string" && typeof (query) != "number") throw new Error("The SQL Query must be a string")
    exports['mysql-async'].mysql_fetch_scalar(query, safeParameters(params), func)
}

/**
 * Execute a query and retrieve the last id insert, async version
 * @param {String} query 
 * @param {Object} params 
 * @param {Function} func 
 */
MySQL.insert = (query, params, func) => {
    if (typeof (query) != "string" && typeof (query) != "number") throw new Error("The SQL Query must be a string")
    exports['mysql-async'].mysql_insert(query, safeParameters(params), func)
}

/**
 * Stores a query for later execution
 * @param {String} query 
 * @param {Function} func 
 */
MySQL.store = (query, func) => {
    if (typeof (query) != "string") throw new Error("The SQL Query must be a string")
    exports['mysql-async'].mysql_store(query, func)
}

/**
 * Execute a List of querys and returns bool true when all are executed successfully
 * @param {Array} querys 
 * @param {Object} params 
 * @param {Function} func 
 * @returns Bool true if successfully
 */
MySQL.transaction = (querys, params, func) => {
    return exports['mysql-async'].mysql_transaction(querys, params, func)
}

MySQL.ready = (callback) => {
    const i = setInterval(() => {
        if (GetResourceState('mysql-async') != 'started') return;
        if (!exports['mysql-async'].is_ready()) return;
        clearInterval(i);
        callback()
    }, 100)
}