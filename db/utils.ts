/**
 * Type mapping utilities
 * Maps Drizzle database types to app TypeScript interfaces
 */

import type { Category, Priority, Task, TaskStatus } from "@/types/task.types";
import type {
  Category as DrizzleCategory,
  Task as DrizzleTask,
} from "./schema";

/**
 * Map Drizzle Category to app Category type
 */
export function mapDrizzleCategoryToCategory(
  drizzleCategory: DrizzleCategory,
  taskCount: number = 0
): Category {
  return {
    id: drizzleCategory.id,
    name: drizzleCategory.name,
    color: drizzleCategory.color,
    taskCount,
    createdAt:
      drizzleCategory.createdAt instanceof Date
        ? drizzleCategory.createdAt
        : new Date(drizzleCategory.createdAt),
    updatedAt:
      drizzleCategory.updatedAt instanceof Date
        ? drizzleCategory.updatedAt
        : new Date(drizzleCategory.updatedAt),
  };
}

/**
 * Map Drizzle Task to app Task type
 * Note: category is loaded separately if needed
 */
export function mapDrizzleTaskToTask(
  drizzleTask: DrizzleTask,
  category?: DrizzleCategory | null
): Task {
  return {
    id: drizzleTask.id,
    title: drizzleTask.title,
    description: drizzleTask.description ?? null,
    status: drizzleTask.status as TaskStatus,
    priority: drizzleTask.priority as Priority,
    dueDate: drizzleTask.dueDate
      ? drizzleTask.dueDate instanceof Date
        ? drizzleTask.dueDate
        : new Date(drizzleTask.dueDate)
      : null,
    position: drizzleTask.position,
    completedAt: drizzleTask.completedAt
      ? drizzleTask.completedAt instanceof Date
        ? drizzleTask.completedAt
        : new Date(drizzleTask.completedAt)
      : null,
    category: category
      ? {
          id: category.id,
          name: category.name,
          color: category.color,
        }
      : null,
    createdAt:
      drizzleTask.createdAt instanceof Date
        ? drizzleTask.createdAt
        : new Date(drizzleTask.createdAt),
    updatedAt:
      drizzleTask.updatedAt instanceof Date
        ? drizzleTask.updatedAt
        : new Date(drizzleTask.updatedAt),
  };
}

/**
 * Helper to convert string dates to Date objects
 */
export function parseDate(
  value: number | Date | null | undefined
): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  return new Date(value);
}
