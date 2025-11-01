/**
 * Database operations for Todo app (Local MVP)
 *
 * This file contains all CRUD operations for tasks and categories
 * using Drizzle ORM. All functions return properly typed data
 * matching the app's TypeScript interfaces.
 *
 * Note: For local MVP, no users table needed - all data belongs to single local user
 */

import { and, desc, eq, sql, count } from "drizzle-orm";
import { getDbInstance } from "./index";
import { categories, tasks } from "./schema";
import type { TaskStatus, Priority } from "@/types/task.types";
import {
  mapDrizzleCategoryToCategory,
  mapDrizzleTaskToTask,
} from "./utils";

// ============================================
// CATEGORY OPERATIONS
// ============================================

/**
 * Create a new category
 */
export async function createCategory(name: string, color: string = "#3B82F6") {
  const db = await getDbInstance();

  const [newCategory] = await db
    .insert(categories)
    .values({
      name,
      color,
    })
    .returning();

  return newCategory;
}

/**
 * Get all categories with task counts
 */
export async function getAllCategories(): Promise<
  ReturnType<typeof mapDrizzleCategoryToCategory>[]
> {
  const db = await getDbInstance();

  const allCategories = await db
    .select({
      category: categories,
      taskCount: sql<number>`COUNT(${tasks.id})`.as("taskCount"),
    })
    .from(categories)
    .leftJoin(tasks, eq(tasks.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(categories.name);

  return allCategories.map(({ category, taskCount }) =>
    mapDrizzleCategoryToCategory(category, taskCount ?? 0)
  );
}

/**
 * Get category by ID with task count
 */
export async function getCategoryById(categoryId: string) {
  const db = await getDbInstance();

  const [result] = await db
    .select({
      category: categories,
      taskCount: sql<number>`COUNT(${tasks.id})`.as("taskCount"),
    })
    .from(categories)
    .leftJoin(tasks, eq(tasks.categoryId, categories.id))
    .where(eq(categories.id, categoryId))
    .groupBy(categories.id)
    .limit(1);

  if (!result) return null;

  return mapDrizzleCategoryToCategory(result.category, result.taskCount ?? 0);
}

/**
 * Update a category
 */
export async function updateCategory(
  categoryId: string,
  updates: { name?: string; color?: string }
) {
  const db = await getDbInstance();

  const [updated] = await db
    .update(categories)
    .set(updates)
    .where(eq(categories.id, categoryId))
    .returning();

  return updated;
}

/**
 * Delete a category
 */
export async function deleteCategory(categoryId: string) {
  const db = await getDbInstance();

  await db.delete(categories).where(eq(categories.id, categoryId));
}

// ============================================
// TASK OPERATIONS
// ============================================

/**
 * Create a new task
 */
export async function createTask(
  title: string,
  options?: {
    description?: string;
    status?: "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDate?: Date;
    categoryId?: string;
  }
) {
  const db = await getDbInstance();

  const [newTask] = await db
    .insert(tasks)
    .values({
      title,
      description: options?.description,
      status: options?.status || "TODO",
      priority: options?.priority || "MEDIUM",
      dueDate: options?.dueDate,
      categoryId: options?.categoryId,
    })
    .returning();

  return newTask;
}

/**
 * Get all tasks with optional filters
 * Returns tasks with their category information
 */
export async function getAllTasks(filters?: {
  status?: TaskStatus;
  categoryId?: string;
  priority?: Priority;
}): Promise<ReturnType<typeof mapDrizzleTaskToTask>[]> {
  const db = await getDbInstance();

  const conditions = [];

  if (filters?.status) {
    conditions.push(eq(tasks.status, filters.status));
  }

  if (filters?.categoryId) {
    conditions.push(eq(tasks.categoryId, filters.categoryId));
  }

  if (filters?.priority) {
    conditions.push(eq(tasks.priority, filters.priority));
  }

  const results = await db
    .select({
      task: tasks,
      category: categories,
    })
    .from(tasks)
    .leftJoin(categories, eq(tasks.categoryId, categories.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(tasks.createdAt));

  return results.map(({ task, category }) =>
    mapDrizzleTaskToTask(task, category ?? undefined)
  );
}

/**
 * Get a single task by ID with category
 */
export async function getTaskById(taskId: string) {
  const db = await getDbInstance();

  const [result] = await db
    .select({
      task: tasks,
      category: categories,
    })
    .from(tasks)
    .leftJoin(categories, eq(tasks.categoryId, categories.id))
    .where(eq(tasks.id, taskId))
    .limit(1);

  if (!result) return null;

  return mapDrizzleTaskToTask(result.task, result.category ?? undefined);
}

/**
 * Update a task
 */
export async function updateTask(
  taskId: string,
  updates: {
    title?: string;
    description?: string | null;
    status?: "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDate?: Date | null;
    categoryId?: string | null;
    completedAt?: Date | null;
  }
) {
  const db = await getDbInstance();

  const [updated] = await db
    .update(tasks)
    .set(updates)
    .where(eq(tasks.id, taskId))
    .returning();

  return updated;
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string) {
  const db = await getDbInstance();

  await db.delete(tasks).where(eq(tasks.id, taskId));
}

/**
 * Get task statistics
 */
export async function getTaskStats() {
  const db = await getDbInstance();

  // Get total tasks
  const [{ totalTasks }] = await db
    .select({ totalTasks: count() })
    .from(tasks);

  // Get completed tasks
  const [{ completedTasks }] = await db
    .select({ completedTasks: count() })
    .from(tasks)
    .where(eq(tasks.status, "DONE"));

  // Get status breakdown
  const statusBreakdown = await db
    .select({
      status: tasks.status,
      count: sql<number>`COUNT(*)`.as("count"),
    })
    .from(tasks)
    .groupBy(tasks.status);

  // Get priority breakdown
  const priorityBreakdown = await db
    .select({
      priority: tasks.priority,
      count: sql<number>`COUNT(*)`.as("count"),
    })
    .from(tasks)
    .groupBy(tasks.priority);

  // Format results
  const statusMap: Record<TaskStatus, number> = {
    TODO: 0,
    IN_PROGRESS: 0,
    DONE: 0,
    CANCELLED: 0,
  };

  const priorityMap: Record<Priority, number> = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    URGENT: 0,
  };

  statusBreakdown.forEach((item) => {
    statusMap[item.status as TaskStatus] = item.count;
  });

  priorityBreakdown.forEach((item) => {
    priorityMap[item.priority as Priority] = item.count;
  });

  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return {
    totalTasks,
    completedTasks,
    completionRate: Math.round(completionRate * 100) / 100, // Round to 2 decimals
    statusBreakdown: statusMap,
    priorityBreakdown: priorityMap,
  };
}
