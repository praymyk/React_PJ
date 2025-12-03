import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: process.env.DB_HOST,      // 예: dev-back.metapbx.co.kr
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,      // 예: aicc_db
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,  // 예: AICC
    waitForConnections: true,
    connectionLimit: 10,
});