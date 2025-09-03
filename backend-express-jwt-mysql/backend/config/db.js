require('dotenv').config(); //load .env
const mysql = require('mysql2/promise');

const dbUrl = process.env.DATABASE_URL || '';

if (!dbUrl) {
    throw new Error('DATABASE URL belum diset di .env')
}

const url =  new URL(dbUrl);
const pool = mysql.createPool({
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.replace(/^\//,''), //path tanpa leading slash
    port: url.port ? Number(url.port) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;