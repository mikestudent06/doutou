# ✅ Todo MVP - Remaining Steps Checklist

## 🎯 Overview
This checklist covers what's needed to complete your local Todo MVP using Drizzle ORM.

---

## 📦 **Phase 1: Backend Integration (Replace API with Local DB)**

### Service Layer Updates
- [ ] **Update `services/task.service.ts`**
  - Replace all API calls with local DB functions from `db/example.ts`
  - Map API response structure to match existing TypeScript types
  - Handle `getTaskStats()` - calculate from local DB data
  - Remove axios/api dependencies

- [ ] **Update `services/category.service.ts`**
  - Replace all API calls with local DB functions from `db/example.ts`
  - Map response structure to match TypeScript types
  - Remove axios/api dependencies

---

## 🎣 **Phase 2: React Hooks Updates**

### Hook Refactoring
- [ ] **Update `hooks/useTasks.ts`**
  - Verify React Query still works with local DB (should work the same)
  - Update query functions to use new service methods
  - Ensure error handling works for local operations
  - Test that mutations (create/update/delete) invalidate queries properly

- [ ] **Update `hooks/useCategories.ts`**
  - Verify React Query integration
  - Ensure category operations trigger task list refresh (when needed)
  - Test error handling

---

## 🎨 **Phase 3: UI Components & Screens**

### Main Task List Screen
- [ ] **Update `app/(tabs)/index.tsx`**
  - Replace static `categories` import with `useCategories()` hook
  - Add `useTasks()` hook to load tasks from DB
  - Implement task filtering by category (when "Toutes" or specific category clicked)
  - Display actual task list from database
  - Handle loading states
  - Handle empty states (show message when no tasks)

- [ ] **Create Task List Component**
  - Component to render individual task items
  - Show task title, description, status, priority, category
  - Add swipe actions (swipe to delete, swipe to complete)
  - Add tap to view/edit task
  - Show category color indicator
  - Show priority badge/indicator
  - Show due date if present

### Task Creation/Editing
- [ ] **Create Task Form Modal/Screen**
  - Input fields: title, description, category selector, priority selector, due date picker
  - Form validation
  - Submit button calls `createTask` mutation
  - Handle form submission states (loading, success, error)
  - Close modal on success

- [ ] **Create Task Edit Screen/Modal**
  - Pre-fill form with existing task data
  - Update button calls `updateTask` mutation
  - Handle loading/error states

- [ ] **Wire up "+" button in `index.tsx`**
  - Open task creation modal/screen when pressed
  - Currently has empty `onPress={() => {}}`

### Category Management
- [ ] **Create Category Form Modal/Screen**
  - Input fields: name, color picker
  - Form validation (unique name check)
  - Submit button calls `createCategory` mutation
  - Handle success/error states

- [ ] **Add Category Management UI**
  - Button/option to create new category
  - List of existing categories with ability to edit/delete
  - Show category color preview

### Task Details/View
- [ ] **Create Task Detail Screen**
  - Display full task information
  - Edit button (navigates to edit screen)
  - Delete button
  - Mark complete/incomplete toggle
  - Show category info
  - Show timestamps (created, updated, completed)

---

## 🔄 **Phase 4: Data Flow & State Management**

### React Query Integration
- [ ] **Verify Query Keys**
  - Ensure query keys are consistent
  - Tasks: `["tasks", params]`
  - Categories: `["categories"]`
  - Task Stats: `["taskStats"]`

- [ ] **Test Query Invalidation**
  - Creating task → invalidates task list
  - Updating task → invalidates task list and stats
  - Deleting task → invalidates task list and stats
  - Creating category → invalidates category list
  - Updating/deleting category → invalidates categories and tasks (since tasks reference categories)

### Type Mapping
- [ ] **Ensure Type Compatibility**
  - Map Drizzle types (`Task`, `Category`) to your existing TypeScript types
  - Check date handling (SQLite stores as integers, convert to Date objects)
  - Ensure enum values match (TaskStatus, Priority)
  - Map category relation in tasks (task.category vs categoryId)

---

## 🎯 **Phase 5: Core Features**

### Task Operations
- [ ] **Create Task**
  - Full form with all fields
  - Category selection
  - Priority selection
  - Due date picker
  - Save to DB

- [ ] **Read/List Tasks**
  - Load all tasks on screen open
  - Filter by category
  - Filter by status (TODO, IN_PROGRESS, DONE)
  - Sort options (by date, priority, etc.)

- [ ] **Update Task**
  - Edit all task fields
  - Change status (mark as done, move to in progress, etc.)
  - Update priority
  - Update category

- [ ] **Delete Task**
  - Swipe to delete gesture
  - Confirmation dialog
  - Delete from DB

### Category Operations
- [ ] **Create Category**
  - Name input
  - Color picker
  - Save to DB

- [ ] **Read Categories**
  - Load categories for filter buttons
  - Display in category selector dropdown

- [ ] **Update Category**
  - Edit name and color
  - Update in DB

- [ ] **Delete Category**
  - Delete button
  - Handle cascade (tasks with this category become uncategorized)
  - Confirmation dialog

### Task Status Management
- [ ] **Mark Task Complete**
  - Toggle status between TODO/DONE
  - Set/clear `completedAt` timestamp
  - Update UI immediately

- [ ] **Change Task Status**
  - Quick actions (TODO → IN_PROGRESS → DONE)
  - Status badges/indicators

---

## 🎨 **Phase 6: UI/UX Enhancements**

### Visual Feedback
- [ ] **Loading States**
  - Skeleton loaders for task list
  - Loading indicators for mutations
  - Disable buttons during operations

- [ ] **Empty States**
  - "No tasks yet" message
  - "Create your first task" prompt
  - Empty category list message

- [ ] **Error Handling**
  - Display error messages to user
  - Toast notifications for success/error
  - Error boundaries for crashes

### User Experience
- [ ] **Smooth Animations**
  - Task list item animations
  - Modal transitions
  - Status change animations

- [ ] **Haptic Feedback**
  - On task completion
  - On delete action
  - On category selection

---

## 📊 **Phase 7: Statistics & Overview** (Optional for MVP)

- [ ] **Task Statistics**
  - Total tasks count
  - Completed tasks count
  - Tasks by status breakdown
  - Tasks by priority breakdown
  - Completion rate percentage

- [ ] **Overview Screen** (`app/(tabs)/overview.tsx`)
  - Display statistics
  - Show recent tasks
  - Show upcoming due dates

---

## 🧪 **Phase 8: Testing & Polish**

### Functionality Testing
- [ ] **Test Task CRUD**
  - Create task → verify appears in list
  - Update task → verify changes saved
  - Delete task → verify removed from list
  - Check task persists after app restart

- [ ] **Test Category CRUD**
  - Create category → verify appears in filters
  - Update category → verify changes reflected
  - Delete category → verify tasks become uncategorized

- [ ] **Test Filtering**
  - Filter by "Toutes" (all tasks)
  - Filter by specific category
  - Verify correct tasks shown

- [ ] **Test Database Persistence**
  - Create data
  - Close app completely
  - Reopen app
  - Verify data still there

### Edge Cases
- [ ] **Handle Empty Database**
  - First time user experience
  - No categories yet
  - No tasks yet

- [ ] **Handle Deleted Categories**
  - Tasks with deleted category show as "Uncategorized"
  - No crash when category missing

- [ ] **Handle Date Formatting**
  - Display dates in user-friendly format
  - Handle null/undefined dates

---

## 🚀 **Phase 9: Deployment Prep** (If needed)

- [ ] **Remove Unused Dependencies**
  - Remove axios if no longer needed
  - Clean up unused imports

- [ ] **Error Logging**
  - Add error logging for DB operations
  - Log database errors

- [ ] **Performance**
  - Optimize queries (already have indexes)
  - Test with many tasks (100+)
  - Verify list rendering performance

---

## 📝 **Summary of Major Tasks**

1. ✅ **DONE**: Drizzle setup, schema, database initialization
2. ⏳ **TODO**: Replace API services with local DB calls
3. ⏳ **TODO**: Update React hooks to use new services
4. ⏳ **TODO**: Build task creation/editing UI
5. ⏳ **TODO**: Build category management UI
6. ⏳ **TODO**: Wire up main screen to display tasks from DB
7. ⏳ **TODO**: Implement filtering and sorting
8. ⏳ **TODO**: Add task status management (complete/incomplete)
9. ⏳ **TODO**: Test complete flow end-to-end
10. ⏳ **TODO**: Polish UI/UX

---

## 🎯 **MVP Definition**

**Minimum Viable Product should have:**
- ✅ Create, read, update, delete tasks
- ✅ Create, read, update, delete categories
- ✅ Tasks can be assigned to categories
- ✅ Filter tasks by category
- ✅ Mark tasks as complete/incomplete
- ✅ Data persists locally
- ✅ Basic UI with task list and forms

**Nice to have (post-MVP):**
- Task statistics
- Task search
- Due date reminders
- Task sorting
- Drag-and-drop reordering
- Task priorities visual indicators

