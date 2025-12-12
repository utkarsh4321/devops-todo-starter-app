require("dotenv").config({ debug: true });
const { defineConfig } = require("drizzle-kit");

// console.log(
//   process.env.DB_CONNECTION,
//   process.env.DB_HOST,
//   process.env.DB_PORT,
//   process.env.DB_DATABASE,
//   process.env.DB_USERNAME,
//   process.env.DB_PASSWORD
// );
module.exports = defineConfig({
  schema: "./schema.js",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: "mysql://root:myrootpassword@localhost:3306",
    // host: process.env.DB_HOST || "localhost",
    // port: process.env.DB_PORT || 3306,
    // user: process.env.DB_USERNAME,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_DATABASE,
  },
});
// module.exports = {
//     schema: './schema.js',
//     out: './drizzle',

//     dbCredentials: {
//         host: 'localhost',
//         user: 'root',
//         password: 'your_password',
//         database: 'my_database'
//     }
// };
