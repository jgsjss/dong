const mysql = require('mysql2/promise');


// const conn = mysql.createConnection({
//     host: "localhost", user: "root", password: "eeta", database: "paycoq"
// });

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "eeta",
    database: "paycoq",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 10
});

// const promisePool = pool.promise();

// const [rows, fields] = await pool.query("select * from user")
// console.log(rows, fields)

// pool.query("select * from user", function (err, rows, fields) {
//     console.log(rows)
// })


module.exports = pool