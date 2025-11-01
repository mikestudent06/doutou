import * as taskDB from "@/db/example";
import type {
  CreateTaskData,
  Priority,
  Task,
  TaskStatus,
  UpdateTaskData,
} from "@/types/task.types";
import { create } from "zustand";
type TaskState = {
  // State
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  // Filters
  selectedCategoryId: string | null;
  statusFilter: TaskStatus | "ALL";
  priorityFilter: Priority | "ALL";

  // Actions - Read
  fetchTasks: () => Promise<void>;

  // Actions - Write
  createTask: (data: CreateTaskData) => Promise<Task | null>;
  updateTask: (taskId: string, data: UpdateTaskData) => Promise<Task | null>;
  deleteTask: (taskId: string) => Promise<void>;

  // Actions - UI State
  setSelectedCategory: (categoryId: string | null) => void;
  setStatusFilter: (status: TaskState["statusFilter"]) => void;
  setPriorityFilter: (priority: TaskState["priorityFilter"]) => void;
  clearFilters: () => void;

  // Actions - Utility
  clearError: () => void;
};

const useTaskStore = create<TaskState>((set, get) => ({
  // Initial state
  tasks: [],
  isLoading: false,
  error: null,
  selectedCategoryId: null,
  statusFilter: "ALL",
  priorityFilter: "ALL",

  // Fetch all tasks with current filters
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { statusFilter, selectedCategoryId, priorityFilter } = get();

      // Build filters
      const filters: {
        status?: TaskStatus;
        categoryId?: string;
        priority?: Priority;
      } = {};

      if (statusFilter !== "ALL") {
        filters.status = statusFilter;
      }

      if (selectedCategoryId) {
        filters.categoryId = selectedCategoryId;
      }

      if (priorityFilter !== "ALL") {
        filters.priority = priorityFilter;
      }

      const tasks = await taskDB.getAllTasks(filters);
      set({ tasks, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load tasks",
        isLoading: false,
      });
    }
  },

  // Create task
  createTask: async (data: CreateTaskData) => {
    set({ isLoading: true, error: null });
    try {
      await taskDB.createTask(data.title, {
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        categoryId: data.categoryId,
      });

      // Refresh tasks to get the newly created task with all relations
      await get().fetchTasks();

      // Return the newly created task from the updated tasks list
      const { tasks } = get();
      const newTask = tasks[tasks.length - 1]; // Last task (newest, due to desc order)
      set({ isLoading: false });

      return newTask || null;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create task",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update task
  updateTask: async (taskId: string, data: UpdateTaskData) => {
    set({ isLoading: true, error: null });
    try {
      const updates: {
        title?: string;
        description?: string | null;
        status?: TaskStatus;
        priority?: Priority;
        dueDate?: Date | null;
        categoryId?: string | null;
        completedAt?: Date | null;
      } = {};

      if (data.title !== undefined) updates.title = data.title;
      if (data.description !== undefined)
        updates.description = data.description;
      if (data.status !== undefined) updates.status = data.status;
      if (data.priority !== undefined) updates.priority = data.priority;
      if (data.dueDate !== undefined)
        updates.dueDate = data.dueDate ? new Date(data.dueDate) : null;
      if (data.categoryId !== undefined) updates.categoryId = data.categoryId;

      // Set completedAt when marking as DONE
      if (data.status === "DONE") {
        updates.completedAt = new Date();
      } else if (data.status !== undefined) {
        // If changing to any status other than DONE, clear completedAt
        updates.completedAt = null;
      }

      await taskDB.updateTask(taskId, updates);

      // Refresh tasks
      await get().fetchTasks();

      // Get updated task from refreshed state
      const { tasks } = get();
      const updatedTask = tasks.find((t) => t.id === taskId);
      set({ isLoading: false });

      return updatedTask || null;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update task",
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete task
  deleteTask: async (taskId: string) => {
    set({ isLoading: true, error: null });
    try {
      await taskDB.deleteTask(taskId);
      // Refresh tasks
      await get().fetchTasks();
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete task",
        isLoading: false,
      });
      throw error;
    }
  },

  // UI state setters
  setSelectedCategory: (categoryId: string | null) => {
    set({ selectedCategoryId: categoryId });
    // Auto-refresh tasks with new filter
    get().fetchTasks();
  },

  setStatusFilter: (status: TaskState["statusFilter"]) => {
    set({ statusFilter: status });
    get().fetchTasks();
  },

  setPriorityFilter: (priority: TaskState["priorityFilter"]) => {
    set({ priorityFilter: priority });
    get().fetchTasks();
  },

  clearFilters: () => {
    set({
      selectedCategoryId: null,
      statusFilter: "ALL",
      priorityFilter: "ALL",
    });
    get().fetchTasks();
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useTaskStore;
