import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: process.env.AICC_DB_HOST,
    port: Number(process.env.AICC_DB_PORT ?? 3306),
    user: process.env.AICC_DB_USER,
    password: process.env.AICC_DB_PASS,
    database: process.env.AICC_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});