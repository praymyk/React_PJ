import 'server-only';
import mysql, { type Pool } from 'mysql2/promise';

const globalForReactpj = global as unknown as {
    reactpjPool?: Pool;
};

export const reactpjPool: Pool =
    globalForReactpj.reactpjPool ??
    mysql.createPool({
        host: process.env.REACTPJ_DB_HOST,
        port: Number(process.env.REACTPJ_DB_PORT ?? 3306),
        user: process.env.REACTPJ_DB_USER,
        password: process.env.REACTPJ_DB_PASS,
        database: process.env.REACTPJ_DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });

if (process.env.NODE_ENV !== 'production') {
    globalForReactpj.reactpjPool = reactpjPool;
}