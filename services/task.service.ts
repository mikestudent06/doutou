import { api } from "@/lib/axios";
import type {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskQueryParams,
  TaskListResponse,
  TaskStats,
} from "@/types/task.types";

export const taskService = {
  async createTask(
    data: CreateTaskData
  ): Promise<{ task: Task; message: string }> {
    const response = await api.post("/tasks", data);
    return response.data;
  },

  async getTasks(params?: TaskQueryParams): Promise<TaskListResponse> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const url = queryString ? `/tasks?${queryString}` : "/tasks";

    const response = await api.get(url);
    return response.data;
  },

  async getTask(taskId: string): Promise<Task> {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  async updateTask(
    taskId: string,
    data: UpdateTaskData
  ): Promise<{ task: Task; message: string }> {
    const response = await api.patch(`/tasks/${taskId}`, data);
    return response.data;
  },

  async deleteTask(taskId: string): Promise<{ message: string }> {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  async getTaskStats(): Promise<TaskStats> {
    const response = await api.get("/tasks/stats");
    return response.data;
  },
};
