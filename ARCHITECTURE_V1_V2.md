# 🏗️ Architecture: V1 (Local) vs V2 (API)

## ✅ Your Approach: Zustand + Drizzle (V1) → React Query (V2)

**V1 (Local MVP):**

- Zustand for state management
- Drizzle for database operations
- Simple, direct, perfect for learning

**V2 (API Integration):**

- React Query for API calls
- Zustand for global UI state (optional)
- Backend API with authentication

---

## 🎯 Why This Approach Works Well

### ✅ **Advantages:**

1. **Simplicity for MVP**

   - Zustand is lightweight and straightforward
   - Direct DB calls don't need React Query's caching complexity
   - Less boilerplate code
   - Easier to understand and debug

2. **Performance**

   - Local DB operations are fast (no network latency)
   - No need for request deduplication or retry logic
   - Simple state updates are immediate

3. **Learning Curve**

   - Focus on Drizzle and state management first
   - Add React Query complexity when you actually need it (for API)
   - Clear separation: local vs remote data

4. **Future-Proof**
   - Easy migration path: Replace Zustand stores with React Query hooks
   - Can keep Zustand for UI state (modals, filters, etc.)
   - Both can coexist in V2

---

## 📐 Recommended Architecture for V1

### Structure:

```
V1 Architecture:
┌─────────────────────────────────┐
│     React Components            │
│  (index.tsx, TaskList, etc.)    │
└──────────────┬──────────────────┘
               │
               ↓
┌─────────────────────────────────┐
│     Zustand Stores              │
│  - useTaskStore                 │
│  - useCategoryStore              │
│  (Async actions call Drizzle)   │
└──────────────┬──────────────────┘
               │
               ↓
┌─────────────────────────────────┐
│     Drizzle Functions           │
│  (db/example.ts)                │
│  - createTask()                 │
│  - getAllTasks()                │
│  - updateTask()                 │
└──────────────┬──────────────────┘
               │
               ↓
┌─────────────────────────────────┐
│     SQLite Database             │
│  (todo.db)                      │
└─────────────────────────────────┘
```

---

## 💾 Zustand Store Pattern for V1

### Task Store Example:

```typescript
// store/task.store.ts
import { create } from "zustand";
import * as taskDB from "@/db/example";
import type { Task } from "@/types/task.types";

type TaskState = {
  // State
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  // Filters
  selectedCategoryId: string | null;
  statusFilter: "ALL" | "TODO" | "IN_PROGRESS" | "DONE";

  // Actions - Read
  fetchTasks: () => Promise<void>;
  fetchTasksByCategory: (categoryId: string) => Promise<void>;

  // Actions - Write
  createTask: (title: string, options?: any) => Promise<void>;
  updateTask: (taskId: string, updates: any) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;

  // Actions - UI State
  setSelectedCategory: (categoryId: string | null) => void;
  setStatusFilter: (status: TaskState["statusFilter"]) => void;
};

const useTaskStore = create<TaskState>((set, get) => ({
  // Initial state
  tasks: [],
  isLoading: false,
  error: null,
  selectedCategoryId: null,
  statusFilter: "ALL",

  // Fetch all tasks
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { statusFilter, selectedCategoryId } = get();

      // Build filters
      const filters: any = {};
      if (statusFilter !== "ALL") {
        filters.status = statusFilter;
      }
      if (selectedCategoryId) {
        filters.categoryId = selectedCategoryId;
      }

      const tasks = await taskDB.getAllTasks(filters);

      // Map Drizzle types to your Task type
      const mappedTasks = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status as Task["status"],
        priority: task.priority as Task["priority"],
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        category: null, // Load separately if needed
        // ... other fields
      }));

      set({ tasks: mappedTasks, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load tasks",
        isLoading: false,
      });
    }
  },

  // Create task
  createTask: async (title: string, options?: any) => {
    set({ isLoading: true, error: null });
    try {
      await taskDB.createTask(title, options);
      // Refresh tasks
      await get().fetchTasks();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create task",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update task
  updateTask: async (taskId: string, updates: any) => {
    set({ isLoading: true, error: null });
    try {
      await taskDB.updateTask(taskId, updates);
      // Refresh tasks
      await get().fetchTasks();
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
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete task",
        isLoading: false,
      });
      throw error;
    }
  },

  // UI state setters
  setSelectedCategory: (categoryId) => {
    set({ selectedCategoryId: categoryId });
    // Auto-refresh tasks with new filter
    get().fetchTasks();
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status });
    get().fetchTasks();
  },
}));

export default useTaskStore;
```

### Category Store Example:

```typescript
// store/category.store.ts
import { create } from "zustand";
import * as categoryDB from "@/db/example";
import type { Category } from "@/types/category.types";

type CategoryState = {
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  fetchCategories: () => Promise<void>;
  createCategory: (name: string, color?: string) => Promise<void>;
  updateCategory: (categoryId: string, updates: any) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
};

const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await categoryDB.getAllCategories();
      // Map Drizzle types
      set({ categories, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to load categories",
        isLoading: false,
      });
    }
  },

  createCategory: async (name: string, color = "#3B82F6") => {
    set({ isLoading: true, error: null });
    try {
      await categoryDB.createCategory(name, color);
      await get().fetchCategories();
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to create category",
        isLoading: false,
      });
      throw error;
    }
  },

  // ... update, delete similar pattern
}));

export default useCategoryStore;
```

---

## 🎨 Usage in Components

### Component Example:

```typescript
// app/(tabs)/index.tsx
import { useEffect } from "react";
import useTaskStore from "@/store/task.store";
import useCategoryStore from "@/store/category.store";

export default function Index() {
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    setSelectedCategory,
    selectedCategoryId,
  } = useTaskStore();

  const { categories, fetchCategories } = useCategoryStore();

  // Load data on mount
  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const handleCreateTask = async () => {
    try {
      await createTask("New Task", {
        priority: "MEDIUM",
        categoryId: selectedCategoryId || undefined,
      });
    } catch (error) {
      // Error already handled in store
      console.error(error);
    }
  };

  return (
    <View>
      {/* Categories filter */}
      {/* Task list */}
      {/* Create button */}
    </View>
  );
}
```

---

## 🔄 Migration Path to V2 (React Query)

When you're ready to add API integration:

### Option 1: Replace Zustand with React Query (Recommended)

```typescript
// V2: Replace useTaskStore with React Query hooks
import { useQuery, useMutation } from "@tanstack/react-query";
import { taskService } from "@/services/task.service"; // Now uses API

// In component:
const { data: tasks } = useQuery({
  queryKey: ["tasks"],
  queryFn: () => taskService.getTasks(), // API call
});

const createMutation = useMutation({
  mutationFn: taskService.createTask,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  },
});
```

### Option 2: Keep Zustand for UI State

```typescript
// V2: Hybrid approach
// Zustand for UI state (modals, filters, etc.)
const useUIStore = create((set) => ({
  isTaskModalOpen: false,
  selectedCategoryId: null,
  // ... UI-only state
}));

// React Query for data
const { data: tasks } = useQuery({
  queryKey: ["tasks", useUIStore.getState().selectedCategoryId],
  queryFn: () => taskService.getTasks(),
});
```

---

## 📋 Updated MVP Checklist for Zustand Approach

### Phase 1: Create Zustand Stores

- [ ] Create `store/task.store.ts`

  - State: tasks, isLoading, error, filters
  - Actions: fetchTasks, createTask, updateTask, deleteTask
  - Filter actions: setSelectedCategory, setStatusFilter

- [ ] Create `store/category.store.ts`
  - State: categories, isLoading, error
  - Actions: fetchCategories, createCategory, updateCategory, deleteCategory

### Phase 2: Remove React Query from V1

- [ ] Remove `@tanstack/react-query` from dependencies (optional, keep if planning V2 soon)
- [ ] Remove React Query setup from `lib/queryClient.ts` usage (or keep commented)
- [ ] Update `hooks/useTasks.ts` → Replace with Zustand store
- [ ] Update `hooks/useCategories.ts` → Replace with Zustand store

### Phase 3: Update Services

- [ ] Update `services/task.service.ts` → Call Drizzle functions directly
- [ ] Update `services/category.service.ts` → Call Drizzle functions directly
- [ ] Or skip services entirely and call Drizzle from Zustand stores

### Phase 4: Update Components

- [ ] Update `app/(tabs)/index.tsx` → Use Zustand stores
- [ ] Replace `useTasks()` hook with `useTaskStore()`
- [ ] Replace `useCategories()` hook with `useCategoryStore()`

---

## 🎯 Best Practices

### 1. **Error Handling**

```typescript
// In Zustand store
try {
  await taskDB.createTask(title);
  await get().fetchTasks(); // Refresh
} catch (error) {
  set({ error: error.message });
  // Could also use toast here
  throw error; // Re-throw if component needs to handle it
}
```

### 2. **Optimistic Updates** (Optional)

```typescript
createTask: async (title: string) => {
  // Optimistic update
  const tempTask = { id: "temp", title, status: "TODO" };
  set({ tasks: [...get().tasks, tempTask] });

  try {
    const newTask = await taskDB.createTask(title);
    // Replace temp with real task
    set({
      tasks: get().tasks.map((t) => (t.id === "temp" ? newTask : t)),
    });
  } catch (error) {
    // Rollback
    set({ tasks: get().tasks.filter((t) => t.id !== "temp") });
    throw error;
  }
};
```

### 3. **Loading States**

```typescript
// Separate loading states for better UX
type TaskState = {
  isFetching: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
};
```

### 4. **Type Mapping**

```typescript
// Helper function to map Drizzle types to your types
function mapDrizzleTaskToTask(drizzleTask: DrizzleTask): Task {
  return {
    id: drizzleTask.id,
    title: drizzleTask.title,
    status: drizzleTask.status as TaskStatus,
    // ... map other fields
  };
}
```

---

## 💡 Summary

**V1 (Current):**

- ✅ Zustand + Drizzle = Simple, direct, perfect for local MVP
- ✅ No React Query complexity
- ✅ Fast, immediate updates
- ✅ Great for learning

**V2 (Future):**

- ✅ React Query for API calls
- ✅ Zustand for UI state (optional)
- ✅ Easy migration: Replace store actions with React Query hooks

**Your approach is excellent!** Start simple, add complexity when you need it. 🚀
