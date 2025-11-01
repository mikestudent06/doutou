# Database Setup with Drizzle ORM

This directory contains your local SQLite database setup using Drizzle ORM.

## 📁 File Structure

- **`schema.ts`** - Defines your database tables (users, categories, tasks)
- **`index.ts`** - Database connection and initialization
- **`example.ts`** - Example CRUD operations (reference implementation)
- **`migrations.ts`** - Migration helper functions

## 🚀 Quick Start

### 1. Initialize Database

Before using the database, you need to initialize it. In your app's root layout or startup:

```typescript
import { initDatabase } from "@/db";

// Call this once when your app starts
await initDatabase();
```

### 2. Using the Database

Import the database instance and schema:

```typescript
import { getDbInstance } from "@/db";
import { tasks, categories, users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Get database instance
const db = await getDbInstance();

// Create a task
const [newTask] = await db
  .insert(tasks)
  .values({
    userId: "user-123",
    title: "Learn Drizzle",
    status: "TODO",
    priority: "HIGH",
  })
  .returning();

// Query tasks
const allTasks = await db
  .select()
  .from(tasks)
  .where(eq(tasks.userId, "user-123"));
```

### 3. Using Example Functions

Check `example.ts` for ready-to-use CRUD functions:

```typescript
import {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
  createCategory,
  getUserCategories,
} from "@/db/example";

// Create a task
const task = await createTask("user-123", "My first task", {
  priority: "HIGH",
  dueDate: new Date("2024-12-31"),
});

// Get all tasks
const tasks = await getUserTasks("user-123", { status: "TODO" });

// Update a task
await updateTask(task.id, { status: "IN_PROGRESS" });
```

## 📊 Schema Overview

### Users Table
- Stores user information (email, password, name, etc.)
- Required for tasks and categories (foreign key relationship)

### Categories Table
- User-defined categories with colors
- Each user can have multiple categories
- Unique constraint on (name, userId)

### Tasks Table
- Main todo items
- Links to user and optional category
- Supports status, priority, due dates

## 🔄 Migrations

For now, the database auto-creates tables on first init. Later, you can use drizzle-kit migrations:

```bash
# Generate migration from schema changes
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Push schema directly (dev only)
pnpm db:push
```

## 💡 Tips

1. **Always initialize**: Call `initDatabase()` before using the database
2. **Use transactions**: For multiple operations, wrap in a transaction
3. **Type safety**: All queries are fully typed thanks to Drizzle!
4. **Relations**: Use Drizzle relations to join tables automatically

## 🔮 Future: Backend Integration

When you're ready to integrate with a backend API:
- Keep the schema structure similar to your Prisma schema
- Create API service functions that mirror the local DB functions
- Use the same TypeScript types for consistency
- Gradually migrate from local DB to API calls

