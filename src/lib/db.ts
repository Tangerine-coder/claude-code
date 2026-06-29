import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'ecommerce.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Global singleton to survive Next.js HMR
const globalForDb = globalThis as unknown as {
  _db: Database.Database | undefined;
  _migrated: boolean | undefined;
};

function getDb(): Database.Database {
  if (!globalForDb._db) {
    globalForDb._db = new Database(DB_PATH);
    globalForDb._db.pragma('journal_mode = WAL');
    globalForDb._db.pragma('foreign_keys = ON');
  }

  // Auto-migrate on first connection
  if (!globalForDb._migrated) {
    const schemaPath = path.join(process.cwd(), 'db', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf-8');
      globalForDb._db.exec(schema);
    }
    globalForDb._migrated = true;

    // Auto-seed if products table is empty
    const count = globalForDb._db.prepare(
      'SELECT COUNT(*) as c FROM products'
    ).get() as { c: number };
    if (count.c === 0) {
      console.log('[DB] Seeding database...');
      const { seedDatabase } = require('./seed');
      seedDatabase(globalForDb._db);
      console.log('[DB] Database seeded successfully!');
    }
  }

  return globalForDb._db;
}

export default getDb;
