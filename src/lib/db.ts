import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { seedDatabase } from './seed';

// Render persistent disk: set DB_PATH env var to e.g. /var/data/ecommerce.db
// This keeps data across redeploys
const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'ecommerce.db');

console.log('[DB] Database path:', DB_PATH);

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Global singleton to survive Next.js HMR
const globalForDb = globalThis as unknown as {
  _db: Database.Database | undefined;
  _initialized: boolean | undefined;
};

function getDb(): Database.Database {
  if (!globalForDb._db) {
    globalForDb._db = new Database(DB_PATH);
    globalForDb._db.pragma('journal_mode = WAL');
    globalForDb._db.pragma('foreign_keys = ON');
  }

  // Run schema only if tables don't exist yet, on every startup
  if (!globalForDb._initialized) {
    globalForDb._initialized = true;

    // Check if schema needs to be applied (users table missing)
    const tableCheck = globalForDb._db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
    ).get() as { name: string } | undefined;

    if (!tableCheck) {
      const schemaPath = path.join(process.cwd(), 'db', 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        globalForDb._db.exec(schema);
        console.log('[DB] Schema applied');
      }

      // Seed if products table is empty
      const count = globalForDb._db.prepare(
        'SELECT COUNT(*) as c FROM products'
      ).get() as { c: number };
      if (count.c === 0) {
        console.log('[DB] Seeding database...');
        seedDatabase(globalForDb._db);
        console.log('[DB] Database seeded successfully!');
      }
    }
  }

  return globalForDb._db;
}

export default getDb;