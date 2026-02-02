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
