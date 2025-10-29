import { api } from "@/lib/axios";
import type {
  CreateCategoryData,
  UpdateCategoryData,
} from "@/types/category.types";
import type { Category } from "@/types/task.types";

export const categoryService = {
  async createCategory(
    data: CreateCategoryData
  ): Promise<{ category: Category; message: string }> {
    const response = await api.post("/categories", data);
    return response.data;
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get("/categories");
    return response.data;
  },

  async updateCategory(
    categoryId: string,
    data: UpdateCategoryData
  ): Promise<{ category: Category; message: string }> {
    const response = await api.patch(`/categories/${categoryId}`, data);
    return response.data;
  },

  async deleteCategory(categoryId: string): Promise<{ message: string }> {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  },
};
