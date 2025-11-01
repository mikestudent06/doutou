import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";
import * as schema from "./schema";
import { generateUUID } from "./uuid";

// Open database connection
// expo-sqlite uses openDatabaseAsync for async operations
let sqlite: SQLite.SQLiteDatabase | null = null;

async function getDatabase() {
  if (!sqlite) {
    sqlite = await SQLite.openDatabaseAsync("todo.db");
  }
  return sqlite;
}

// Default categories to create on first initialization
const DEFAULT_CATEGORIES = [
  { name: "Travail", color: "#3B82F6" }, // Blue
  { name: "Personnel", color: "#10B981" }, // Green
  { name: "Courses", color: "#F59E0B" }, // Orange/Amber
  { name: "Etudes", color: "#8B5CF6" }, // Purple
];

// Initialize database and create tables if they don't exist
export async function initDatabase() {
  const db = await getDatabase();

  // Drop existing tables if they have old schema (with user_id)
  // This is safe for MVP - data will be recreated
  try {
    await db.execAsync(`
      DROP TABLE IF EXISTS tasks;
      DROP TABLE IF EXISTS categories;
      DROP TABLE IF EXISTS users;
    `);
  } catch {
    // Ignore errors if tables don't exist
    console.log("Cleaning old schema...");
  }

  // Create tables using SQL (since we're setting up manually for now)
  // For local MVP: No users table needed - using single local user
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#3B82F6',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      UNIQUE(name)
    );
    
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'TODO',
      priority TEXT NOT NULL DEFAULT 'MEDIUM',
      due_date INTEGER,
      position INTEGER NOT NULL DEFAULT 0,
      completed_at INTEGER,
      category_id TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
  `);

  // Initialize default categories if they don't exist
  await initDefaultCategories();

  return db;
}

// Initialize default categories
async function initDefaultCategories() {
  try {
    // Use getDb() instead of getDbInstance() to avoid recursion
    const db = await getDb();
    const { categories } = await import("./schema");

    // Check if any categories exist
    const existingCategories = await db.select().from(categories);

    console.log(
      `[DB Init] Existing categories count: ${existingCategories.length}`
    );

    // If no categories exist, create default ones
    if (existingCategories.length === 0) {
      console.log("[DB Init] Creating default categories...");
      const now = new Date();

      for (const category of DEFAULT_CATEGORIES) {
        await db.insert(categories).values({
          id: generateUUID(),
          name: category.name,
          color: category.color,
          createdAt: now,
          updatedAt: now,
        });
      }

      console.log(
        `[DB Init] Created ${DEFAULT_CATEGORIES.length} default categories`
      );
    } else {
      console.log(
        `[DB Init] Categories already exist, skipping default creation`
      );
    }
  } catch (error) {
    console.error("[DB Init] Error initializing default categories:", error);
    throw error;
  }
}

// Get Drizzle database instance
export async function getDb() {
  const database = await getDatabase();
  return drizzle(database, { schema });
}

// For backward compatibility and easier usage, create a singleton
let dbInstance: ReturnType<typeof drizzle> | null = null;

export async function getDbInstance() {
  if (!dbInstance) {
    await initDatabase();
    const database = await getDatabase();
    dbInstance = drizzle(database, { schema });
  }
  return dbInstance;
}

// Export schema for easy imports
export * from "./schema";
