const mysql = require('mysql2/promise');


// const conn = mysql.createConnection({
//     host: "localhost", user: "root", password: "eeta", database: "paycoq"
// });

const pool = mysql.createPool({
    host: "34.82.201.150",
    user: "root",
    password: "0000",
    database: "paycoq",
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 5
});

// const promisePool = pool.promise();

// const [rows, fields] = await pool.query("select * from user")
// console.log(rows, fields)

// pool.query("select * from user", function (err, rows, fields) {
//     console.log(rows)
// })


module.exports = pool