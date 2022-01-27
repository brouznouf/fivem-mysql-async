MySQL.ready(async function () {
    // Async/Await demo:

    console.log(await MySQL.Async.fetchScalar("SELECT @parameters", { "@parameters": 1 }))

    console.log(await MySQL.Async.fetchScalar("SELECT @parameters", { "@parameters": "Hello World" }))

    console.log(await MySQL.Async.fetchAll("SELECT * FROM whitelist", {}))

    console.log(await MySQL.Async.insert("INSERT INTO players(name, money, location) VALUES (@name, @money, @location)",
        {
            "@name": "Player 1",
            "@money": 5000,
            "@location": JSON.stringify({ x: 50, y: 10, z: 20 })
        })
    )

    // Callback demo:
    MySQL.fetchScalar("SELECT @parameters", { "@parameters": 1 }, function (result) {
        console.log(result);
    })

    MySQL.fetchScalar("SELECT @parameters", { "@parameters": "Hello Callback!" }, function (result) {
        console.log(result);
    })

    MySQL.fetchAll("SELECT * FROM whitelist", {}, function (results) {
        console.log(results);
    })

    MySQL.insert("INSERT INTO players(name, money, location) VALUES (@name, @money, @location)",
        {
            "@name": "Player 1",
            "@money": 5000,
            "@location": JSON.stringify({ x: 50, y: 10, z: 20 })
        },
        function (insertId) {
            console.log(insertId)
        }
    )
})