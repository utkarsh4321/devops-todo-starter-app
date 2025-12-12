const { drizzle } = require("drizzle-orm/mysql2");
const mysql = require("mysql2/promise");
const { migrate } = require("drizzle-orm/mysql2/migrator");
const { todos } = require("./schema");
require("dotenv").config();

console.log(
  "dotenv",
  process.env.DB_HOST,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  process.env.DB_DATABASE
);
async function main() {
  try {
    // Initialize MySQL connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT,
    });

    // Initialize Drizzle ORM
    const db = drizzle(connection);

    // Run migrations
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations applied successfully");

    // Seed some sample todos (optional)
    const existingTodos = await db.select().from(todos);
    if (existingTodos.length === 0) {
      await db.insert(todos).values([
        {
          title: "Learn Drizzle ORM",
          completed: 0,
        },
        {
          title: "Build Todo API",
          completed: 1,
        },
      ]);
      console.log("Sample todos seeded successfully!");
    } else {
      console.log("Table already contains data, skipping seeding");
    }

    // Close connection
    await connection.end();
  } catch (error) {
    console.error("Migration or seeding failed:", error);
    process.exit(1);
  }
}

main();
