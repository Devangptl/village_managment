import mysql from 'mysql2/promise';

let pool;

if (!globalThis.__dbPool) {
  globalThis.__dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
  });
}

pool = globalThis.__dbPool;

export default pool;

export async function query(sql, params) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("Database Query Error:", error);
    throw error;
  }
}

export async function queryOne(sql, params) {
  const rows = await query(sql, params);
  return rows[0] || null;
}
