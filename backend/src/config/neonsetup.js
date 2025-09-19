import { neon } from "@neondatabase/serverless";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL missing");
}

const sql = neon(process.env.DATABASE_URL, {
  fetchOptions: {
    timeout: 60000,
  },
  pool: {
    max: 10,
    idleTimeoutMillis: 30000,
  },
});

// ✅ Test connection (runs once when server starts)
(async () => {
  try {
    const result = await sql`SELECT NOW();`;
    console.log("✅ Connected to database ");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

export default sql;
