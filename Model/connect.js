const sql = require("mssql");
require("dotenv").config();
// config for your database
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    trustServerCertificate: true,
};

const connect = new sql.ConnectionPool(config).connect().then(pool => {return pool})

module.exports = {
    connect: connect,
    sql: sql
}