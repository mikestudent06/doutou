/**
 * Database migration helper
 * 
 * This file helps manage database migrations.
 * For now, we're using initDatabase() from index.ts,
 * but later you can use drizzle-kit migrations.
 */

import { initDatabase } from "./index";

/**
 * Run all pending migrations
 * For now, this just initializes the database schema
 */
export async function runMigrations() {
  try {
    await initDatabase();
    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    throw error;
  }
}

