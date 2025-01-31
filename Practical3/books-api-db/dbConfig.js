module.exports = {
  host: "localhost",      // Use 'host' instead of 'server'
  user: "root",
  password: "123456",
  database: "bed_db",
  port: 3306,            // MySQL default port (not 1433 which is for SQL Server)
  connectTimeout: 60000,  // MySQL connection timeout format
  waitForConnections: true,
  connectionLimit: 10     // Optional: if you want to use connection pooling
};