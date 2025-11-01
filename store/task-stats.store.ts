import * as taskDB from "@/db/example";
import type { TaskStats } from "@/types/task.types";
import { create } from "zustand";

type TaskStatsState = {
  // State
  stats: TaskStats | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchStats: () => Promise<void>;
  clearError: () => void;
};

const useTaskStatsStore = create<TaskStatsState>((set) => ({
  // Initial state
  stats: null,
  isLoading: false,
  error: null,

  // Fetch task statistics
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await taskDB.getTaskStats();
      set({ stats, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load task statistics",
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useTaskStatsStore;
