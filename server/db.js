const mysql = require('mysql2/promise');

// Soportar múltiples formas de proporcionar credenciales de base de datos:
// - Variables individuales: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
// - URL completa: MYSQL_URL, MYSQL_PUBLIC_URL, DATABASE_URL (p.ej. mysql://user:pass@host:port/db)

function parseDatabaseUrl(url) {
  try {
    const u = new URL(url);
    return {
      host: u.hostname,
      port: u.port ? Number(u.port) : 3306,
      user: u.username,
      password: u.password,
      database: u.pathname ? u.pathname.replace(/^\//, '') : undefined,
    };
  } catch (e) {
    return null;
  }
}

// Preferir las variables de URL de conexión explícitas si están presentes
const connectionUrl = process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL || process.env.DATABASE_URL;
let cfg = null;
if (connectionUrl) {
  cfg = parseDatabaseUrl(connectionUrl);
}

const pool = mysql.createPool({
  host: cfg?.host || process.env.DB_HOST || 'localhost',
  port: cfg?.port || (process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306),
  user: cfg?.user || process.env.DB_USER || 'root',
  password: cfg?.password || process.env.DB_PASSWORD || '',
  database: cfg?.database || process.env.DB_NAME || 'retro_gaming',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'Z',
  dateStrings: true,
});

module.exports = { pool };
