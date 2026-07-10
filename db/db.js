const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: 'postgres',
    database: 'mydb'
});

pool.connect()
    .then(() => console.log("Database connected"))
    .catch(err => console.error("DB connection error:", err));
module.exports = pool;   
