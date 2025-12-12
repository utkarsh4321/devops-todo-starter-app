const {
  mysqlTable,
  varchar,
  int,
  serial,
  timestamp,
} = require("drizzle-orm/mysql-core");

// Define countries table schema

const todos = mysqlTable("todos", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  completed: int("completed").default(0).notNull(), // 0 = false, 1 = true
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

module.exports = { todos };
