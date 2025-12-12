const { drizzle } = require("drizzle-orm/mysql2");
const mysql = require("mysql2/promise");

let db = null;
let connection = null;

async function initDb(retryCount = 0) {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    connection.on("error", async (err) => {
      console.error("DB connection error:", err);
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        console.log("Attempting to reconnect to DB...");
        await initDb();
      }
    });

    // Initialize Drizzle ORM
    db = drizzle(connection);
    console.log("Database connection initialized");
  } catch (error) {
    console.error("Database connection failed:", error);
    if (retryCount < 5) {
      const delay = 5000;
      console.log(`Retrying DB connection in ${delay / 1000} seconds...`);
      setTimeout(() => initDb(retryCount + 1), delay);
    } else {
      console.error("Max DB connection retries reached.");
      process.exit(1);
    }
  }
}

// Export getter functions
function getDb() {
  if (!db) {
    throw new Error("Database not initialized. Call initDb() first.");
  }
  return db;
}

module.exports = {
  getDb,
  initDb,
};
