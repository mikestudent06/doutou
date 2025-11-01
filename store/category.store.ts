import * as categoryDB from "@/db/example";
import type {
  CreateCategoryData,
  UpdateCategoryData,
} from "@/types/category.types";
import type { Category } from "@/types/task.types";
import { create } from "zustand";

type CategoryState = {
  // State
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Actions - Read
  fetchCategories: () => Promise<void>;

  // Actions - Write
  createCategory: (data: CreateCategoryData) => Promise<Category | null>;
  updateCategory: (
    categoryId: string,
    data: UpdateCategoryData
  ) => Promise<Category | null>;
  deleteCategory: (categoryId: string) => Promise<void>;

  // Actions - Utility
  clearError: () => void;
};

const useCategoryStore = create<CategoryState>((set, get) => ({
  // Initial state
  categories: [],
  isLoading: false,
  error: null,

  // Fetch all categories
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await categoryDB.getAllCategories();
      console.log("categories", categories);
      set({ categories, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to load categories",
        isLoading: false,
      });
    }
  },

  // Create category
  createCategory: async (data: CreateCategoryData) => {
    set({ isLoading: true, error: null });
    try {
      const newCategory = await categoryDB.createCategory(
        data.name,
        data.color || "#3B82F6"
      );

      // Refresh categories (which includes task counts)
      await get().fetchCategories();

      // Return the created category from refreshed state
      const { categories } = get();
      const createdCategory = categories.find((c) => c.id === newCategory.id);
      set({ isLoading: false });

      return createdCategory || null;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to create category",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update category
  updateCategory: async (categoryId: string, data: UpdateCategoryData) => {
    set({ isLoading: true, error: null });
    try {
      const updates: { name?: string; color?: string } = {};

      if (data.name !== undefined) updates.name = data.name;
      if (data.color !== undefined) updates.color = data.color;

      await categoryDB.updateCategory(categoryId, updates);

      // Refresh categories
      await get().fetchCategories();

      // Get updated category from refreshed state
      const { categories } = get();
      const updatedCategory = categories.find((c) => c.id === categoryId);
      set({ isLoading: false });

      return updatedCategory || null;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update category",
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete category
  deleteCategory: async (categoryId: string) => {
    set({ isLoading: true, error: null });
    try {
      await categoryDB.deleteCategory(categoryId);
      // Refresh categories
      await get().fetchCategories();
      set({ isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete category",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useCategoryStore;
