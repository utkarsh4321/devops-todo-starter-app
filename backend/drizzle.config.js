require("dotenv").config({ debug: true });
const { defineConfig } = require("drizzle-kit");

module.exports = defineConfig({
  schema: "./schema.js",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: `mysql://root:${process.env.DB_PASSWORD}@localhost:3306`,
  },
});
