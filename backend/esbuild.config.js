// build.js
const esbuild = require("esbuild");
const { copy } = require("esbuild-plugin-copy");
esbuild
  .build({
    entryPoints: ["./index.js"],
    bundle: true,
    outfile: "./dist/bundle.js",
    platform: "node",
    plugins: [
      copy({
        resolveFrom: "cwd",
        assets: [
          {
            from: "./drizzle/**/*",
            to: "dist/drizzle",
          },
          { from: "./package.json", to: "dist/package.json" },
          { from: "./drizzle.config.js", to: "dist/drizzle.config.js" },
          { from: "./migrate.js", to: "dist/migrate.js" },
          { from: "./schema.js", to: "dist/schema.js" },
        ],
      }),
    ],
    // Add other options like minify, sourcemap, etc.
  })
  .catch(() => process.exit(1));
