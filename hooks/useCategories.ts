import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import type { UpdateCategoryData } from "@/types/category.types";
import toast from "react-hot-toast";

export const useCategories = () => {
  const queryClient = useQueryClient();

  // Get categories
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create category");
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: UpdateCategoryData;
    }) => categoryService.updateCategory(categoryId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refresh tasks too
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update category");
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refresh tasks too
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
    },
  });

  return {
    // Data
    categories,
    isCategoriesLoading,

    // Actions
    createCategory: createCategoryMutation.mutate,
    updateCategory: (categoryId: string, data: UpdateCategoryData) =>
      updateCategoryMutation.mutate({ categoryId, data }),
    deleteCategory: deleteCategoryMutation.mutate,

    // Loading states
    isCreatingCategory: createCategoryMutation.isPending,
    isUpdatingCategory: updateCategoryMutation.isPending,
    isDeletingCategory: deleteCategoryMutation.isPending,
  };
};
