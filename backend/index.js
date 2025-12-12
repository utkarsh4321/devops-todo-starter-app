const express = require("express");
const cors = require("cors");
const { initDb } = require("./db");
const { router: todoRoutes } = require("./routes/todos");

const app = express();
const port = 5500;

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN, // Allow requests from the frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
); // Enable CORS for all routes

// Middleware to parse JSON
app.use(express.json());

// // Global database connection
// let db;
// let connection;

// // MySQL connection configuration
// async function initDb(retryCount = 0) {
//   try {
//     connection = await mysql.createConnection({
//       host: process.env.DB_HOST || "localhost",
//       user: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_DATABASE,
//     });
//     connection.on("error", async (err) => {
//       console.error("DB connection error:", err);
//       if (err.code === "PROTOCOL_CONNECTION_LOST") {
//         console.log("Attempting to reconnect to DB...");
//         await initDb();
//       }
//     });

//     // Initialize Drizzle ORM
//     db = drizzle(connection);
//     console.log("Database connection initialized");
//   } catch (error) {
//     console.error("Database connection failed:", error);
//     if (retryCount < 5) {
//       const delay = 5000;
//       console.log(`Retrying DB connection in ${delay / 1000} seconds...`);
//       setTimeout(() => initDb(retryCount + 1), delay);
//     } else {
//       console.error("Max DB connection retries reached.");
//       process.exit(1);
//     }
//   }
// }

// Example route to get all countries
// app.get("/countries", async (req, res) => {
//   try {
//     const result = await db.select().from(countries);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Example route to create a country
// app.post("/countries", async (req, res) => {
//   try {
//     const { name, code, population } = req.body;
//     const result = await db
//       .insert(countries)
//       .values({ name, code, population });
//     res.status(201).json({ id: result.insertId, name, code, population });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
// Routes
app.use("/api/todos", todoRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Todo API is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
// Start the server
async function startServer() {
  try {
    await initDb(); // Initialize database once at startup
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
