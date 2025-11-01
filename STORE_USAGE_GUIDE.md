# 📚 Zustand Stores & Drizzle Functions - Usage Guide

## ✅ Everything is Ready!

All stores and database functions are fully typed and ready to use in your UI components.

---

## 🗂️ File Structure

```
db/
├── index.ts              # Database connection & initialization
├── schema.ts             # Drizzle schema definitions
├── example.ts            # All CRUD operations (renamed from example)
├── utils.ts              # Type mapping utilities
└── index-exports.ts      # Central exports

store/
├── task.store.ts         # Task state management
├── category.store.ts     # Category state management
├── task-stats.store.ts   # Task statistics
└── index.ts              # Central exports
```

---

## 🎯 Quick Start

### In Your Components:

```typescript
import { useTaskStore, useCategoryStore } from "@/store";
import { useEffect } from "react";

export default function TodoScreen() {
  // Task store
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setSelectedCategory,
    selectedCategoryId,
  } = useTaskStore();

  // Category store
  const {
    categories,
    fetchCategories,
    createCategory,
  } = useCategoryStore();

  // Load data on mount
  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  // Create a task
  const handleCreateTask = async () => {
    try {
      await createTask({
        title: "New Task",
        priority: "HIGH",
        categoryId: selectedCategoryId || undefined,
      });
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <View>
      {/* Your UI here */}
    </View>
  );
}
```

---

## 📖 Store APIs

### `useTaskStore`

#### State:
```typescript
{
  tasks: Task[];                    // Array of all tasks
  isLoading: boolean;              // Loading state
  error: string | null;            // Error message
  selectedCategoryId: string | null; // Current category filter
  statusFilter: TaskStatus | "ALL"; // Current status filter
  priorityFilter: Priority | "ALL"; // Current priority filter
}
```

#### Actions:
```typescript
// Read
fetchTasks(): Promise<void>        // Load tasks with current filters

// Write
createTask(data: CreateTaskData): Promise<Task | null>
updateTask(taskId: string, data: UpdateTaskData): Promise<Task | null>
deleteTask(taskId: string): Promise<void>

// Filters
setSelectedCategory(categoryId: string | null): void
setStatusFilter(status: TaskStatus | "ALL"): void
setPriorityFilter(priority: Priority | "ALL"): void
clearFilters(): void

// Utility
clearError(): void
```

#### Example:
```typescript
const { tasks, createTask, updateTask } = useTaskStore();

// Create task
await createTask({
  title: "Finish MVP",
  description: "Complete the Todo app",
  priority: "HIGH",
  categoryId: "category-id",
  dueDate: "2024-12-31",
});

// Update task
await updateTask("task-id", {
  status: "DONE",
  priority: "URGENT",
});

// Filter by category
setSelectedCategory("category-id");

// Filter by status
setStatusFilter("DONE");
```

---

### `useCategoryStore`

#### State:
```typescript
{
  categories: Category[];  // Array of all categories with task counts
  isLoading: boolean;      // Loading state
  error: string | null;    // Error message
}
```

#### Actions:
```typescript
// Read
fetchCategories(): Promise<void>

// Write
createCategory(data: CreateCategoryData): Promise<Category | null>
updateCategory(categoryId: string, data: UpdateCategoryData): Promise<Category | null>
deleteCategory(categoryId: string): Promise<void>

// Utility
clearError(): void
```

#### Example:
```typescript
const { categories, createCategory } = useCategoryStore();

// Create category
await createCategory({
  name: "Work",
  color: "#FF5733",
});

// Update category
await updateCategory("category-id", {
  name: "Personal Work",
  color: "#33FF57",
});
```

---

### `useTaskStatsStore`

#### State:
```typescript
{
  stats: TaskStats | null;  // Statistics object
  isLoading: boolean;       // Loading state
  error: string | null;     // Error message
}
```

#### Actions:
```typescript
fetchStats(): Promise<void>
clearError(): void
```

#### Example:
```typescript
const { stats, fetchStats } = useTaskStatsStore();

useEffect(() => {
  fetchStats();
}, []);

// stats contains:
// {
//   totalTasks: number;
//   completedTasks: number;
//   completionRate: number;
//   statusBreakdown: Record<TaskStatus, number>;
//   priorityBreakdown: Record<Priority, number>;
// }
```

---

## 🗄️ Database Functions

All database functions are in `db/example.ts` and are automatically typed.

### Category Functions:
```typescript
createCategory(name: string, color?: string): Promise<DrizzleCategory>
getAllCategories(): Promise<Category[]>  // Includes task counts
getCategoryById(categoryId: string): Promise<Category | null>
updateCategory(categoryId: string, updates: {...}): Promise<DrizzleCategory>
deleteCategory(categoryId: string): Promise<void>
```

### Task Functions:
```typescript
createTask(title: string, options?: {...}): Promise<DrizzleTask>
getAllTasks(filters?: {...}): Promise<Task[]>  // Includes category info
getTaskById(taskId: string): Promise<Task | null>
updateTask(taskId: string, updates: {...}): Promise<DrizzleTask>
deleteTask(taskId: string): Promise<void>
getTaskStats(): Promise<TaskStats>
```

**Note:** You typically won't call these directly from components. Use the Zustand stores instead.

---

## 🔄 Common Patterns

### 1. Create Task with Category
```typescript
const { createTask } = useTaskStore();
const { categories } = useCategoryStore();

const handleCreate = async () => {
  await createTask({
    title: "New Task",
    categoryId: categories[0]?.id,
    priority: "MEDIUM",
  });
};
```

### 2. Filter Tasks by Category
```typescript
const { setSelectedCategory, tasks } = useTaskStore();

// User clicks category filter
<TouchableOpacity onPress={() => setSelectedCategory(categoryId)}>
  <Text>{category.name}</Text>
</TouchableOpacity>

// Tasks automatically filtered and refreshed
```

### 3. Mark Task as Complete
```typescript
const { updateTask } = useTaskStore();

const handleComplete = async (taskId: string) => {
  await updateTask(taskId, {
    status: "DONE",
  });
  // completedAt is automatically set
};
```

### 4. Delete Task with Confirmation
```typescript
const { deleteTask } = useTaskStore();

const handleDelete = async (taskId: string) => {
  // Show confirmation dialog first
  Alert.alert(
    "Delete Task",
    "Are you sure?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTask(taskId);
          } catch (error) {
            // Handle error
          }
        },
      },
    ]
  );
};
```

### 5. Handle Loading & Error States
```typescript
const { tasks, isLoading, error, clearError } = useTaskStore();

if (isLoading) {
  return <Loader />;
}

if (error) {
  return (
    <View>
      <Text>{error}</Text>
      <Button onPress={clearError}>Dismiss</Button>
    </View>
  );
}

return <TaskList tasks={tasks} />;
```

---

## 🎨 TypeScript Types

All types are exported from:
- `@/types/task.types` - Task, TaskStatus, Priority, CreateTaskData, UpdateTaskData
- `@/types/category.types` - CreateCategoryData, UpdateCategoryData

### Task Type:
```typescript
interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: Date | null;
  position: number;
  completedAt: Date | null;
  category: {
    id: string;
    name: string;
    color: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Category Type:
```typescript
interface Category {
  id: string;
  name: string;
  color: string;
  taskCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 💡 Best Practices

1. **Always handle errors:**
   ```typescript
   try {
     await createTask(data);
   } catch (error) {
     // Show toast or error message
   }
   ```

2. **Use loading states:**
   ```typescript
   if (isLoading) return <Loader />;
   ```

3. **Clear filters when needed:**
   ```typescript
   const { clearFilters } = useTaskStore();
   // User clicks "Show All"
   clearFilters();
   ```

4. **Refresh after mutations:**
   ```typescript
   // Stores automatically refresh after create/update/delete
   // No need to manually call fetchTasks()
   ```

5. **Use TypeScript:**
   ```typescript
   // All functions are fully typed
   // You'll get autocomplete and type checking
   ```

---

## 🚀 Ready to Use!

Everything is set up and typed. Start using the stores in your components!

```typescript
import { useTaskStore, useCategoryStore } from "@/store";

// That's it! Full type safety and autocomplete! 🎉
```

