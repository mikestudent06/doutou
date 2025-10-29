import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/task.service";
import type { UpdateTaskData, TaskQueryParams } from "@/types/task.types";
import toast from "react-hot-toast";

export const useTasks = (params?: TaskQueryParams) => {
  const queryClient = useQueryClient();

  // Get tasks with filtering/pagination
  const { data: taskData, isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks", params],
    queryFn: () => taskService.getTasks(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Get task statistics
  const { data: taskStats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["taskStats"],
    queryFn: taskService.getTaskStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["taskStats"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create task");
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskData }) =>
      taskService.updateTask(taskId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["taskStats"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update task");
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["taskStats"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete task");
    },
  });

  return {
    // Data
    tasks: taskData?.tasks || [],
    pagination: taskData?.pagination,
    taskStats,

    // Loading states
    isTasksLoading,
    isStatsLoading,
    isCreatingTask: createTaskMutation.isPending,
    isUpdatingTask: updateTaskMutation.isPending,
    isDeletingTask: deleteTaskMutation.isPending,

    // Actions
    createTask: createTaskMutation.mutate,
    updateTask: (taskId: string, data: UpdateTaskData) =>
      updateTaskMutation.mutate({ taskId, data }),
    deleteTask: deleteTaskMutation.mutate,
  };
};
