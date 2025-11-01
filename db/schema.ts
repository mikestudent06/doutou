import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { generateUUID } from "./uuid";

// Enums as constants (SQLite doesn't support native enums)
export const TaskStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
  CANCELLED: "CANCELLED",
} as const;

export const Priority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

// For local MVP: No users table needed
// When you integrate backend API, you can add users back
// For now, we'll use a constant default user ID

// Default user ID for local MVP (single user app)
export const DEFAULT_USER_ID = "local-user-1";

// Categories table
export const categories = sqliteTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUUID()),
  name: text("name").notNull(),
  color: text("color").notNull().default("#3B82F6"), // Hex color code
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Tasks table
export const tasks = sqliteTable("tasks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUUID()),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("TODO"),
  priority: text("priority").notNull().default("MEDIUM"),
  dueDate: integer("due_date", { mode: "timestamp" }),
  position: integer("position").notNull().default(0), // For ordering/drag-drop
  completedAt: integer("completed_at", { mode: "timestamp" }),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  category: one(categories, {
    fields: [tasks.categoryId],
    references: [categories.id],
  }),
}));

// Export types
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
