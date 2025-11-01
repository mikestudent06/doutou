# 🔄 App Flow Without Users Table (Local MVP)

## Understanding the Flow

Since we removed the users table, **everything in the database belongs to a single local user** - the person using the app on their device.

---

## 📱 **App Initialization Flow**

```
App Starts
    ↓
useDatabase() hook runs (in _layout.tsx)
    ↓
initDatabase() executes
    ↓
Creates SQLite database: "todo.db"
    ↓
Creates tables:
  - categories (no user_id column)
  - tasks (no user_id column)
    ↓
Database Ready ✅
    ↓
App Renders
```

**Key Point:** No user authentication needed. The database is device-specific.

---

## 🏗️ **Database Structure**

### Categories Table

```
┌─────────────┬──────────────┐
│ Column      │ Purpose      │
├─────────────┼──────────────┤
│ id          │ Unique ID    │
│ name        │ Category name│
│ color       │ Hex color    │
│ created_at  │ Timestamp    │
│ updated_at  │ Timestamp    │
└─────────────┴──────────────┘

Note: NO user_id column - all categories belong to this device
```

### Tasks Table

```
┌──────────────┬──────────────────────┐
│ Column       │ Purpose              │
├──────────────┼──────────────────────┤
│ id           │ Unique ID            │
│ title        │ Task title           │
│ description  │ Optional details     │
│ status       │ TODO/IN_PROGRESS/etc │
│ priority     │ LOW/MEDIUM/HIGH/URGENT│
│ category_id  │ Links to category    │
│ due_date     │ Optional deadline    │
│ created_at   │ Timestamp            │
│ updated_at   │ Timestamp            │
└──────────────┴──────────────────────┘

Note: NO user_id column - all tasks belong to this device
```

---

## 🔄 **CRUD Operations Flow**

### 1️⃣ **CREATE Flow**

#### Creating a Category:

```typescript
// User clicks "Add Category" → "Work"
await createCategory("Work", "#FF5733");

// What happens:
// 1. Get database connection
// 2. INSERT into categories table
// 3. No userId needed - just name & color
// 4. Returns: { id: "uuid", name: "Work", color: "#FF5733", ... }
```

#### Creating a Task:

```typescript
// User clicks "+" → fills form → "Create Task"
await createTask("Finish project", {
  description: "Complete the MVP",
  priority: "HIGH",
  categoryId: "work-category-id",
  dueDate: new Date("2024-12-31"),
});

// What happens:
// 1. Get database connection
// 2. INSERT into tasks table
// 3. No userId needed - just task data
// 4. Links to category via categoryId
// 5. Returns: { id: "uuid", title: "Finish project", ... }
```

**Key Difference from Multi-User:**

- ❌ **Before:** `createTask(userId, "Title")`
- ✅ **Now:** `createTask("Title")` - no userId parameter!

---

### 2️⃣ **READ Flow**

#### Loading All Tasks:

```typescript
// App opens → Component mounts
const tasks = await getAllTasks({ status: "TODO" });

// What happens:
// 1. SELECT * FROM tasks WHERE status = 'TODO'
// 2. NO WHERE user_id = ? clause needed
// 3. Returns all tasks on this device
// 4. Returns: [{ id, title, status, ... }, ...]
```

#### Loading Categories:

```typescript
// App opens → Category filter loads
const categories = await getAllCategories();

// What happens:
// 1. SELECT * FROM categories
// 2. NO user filtering needed
// 3. Returns all categories on this device
// 4. Returns: [{ id, name, color, ... }, ...]
```

**Why This Works:**

- The SQLite database file (`todo.db`) is **stored on the device**
- Only **one person uses this device** (for MVP)
- So ALL data in the database belongs to that person
- No need to filter by user!

---

### 3️⃣ **UPDATE Flow**

```typescript
// User checks off a task
await updateTask(taskId, {
  status: "DONE",
  completedAt: new Date(),
});

// What happens:
// 1. UPDATE tasks SET status='DONE', completed_at=...
// 2. WHERE id = taskId
// 3. NO user check needed - if task exists, it's yours
```

---

### 4️⃣ **DELETE Flow**

```typescript
// User swipes to delete
await deleteTask(taskId);

// What happens:
// 1. DELETE FROM tasks WHERE id = taskId
// 2. No user verification needed
```

---

## 🎯 **Real-World Example Flow**

### Scenario: User creates their first task

```
1. User opens app
   → Database initializes (if first time)
   → Creates empty tables

2. User clicks "+" button
   → Opens "Create Task" modal/form

3. User fills in:
   - Title: "Buy groceries"
   - Category: Selects "Personal" (or creates new)
   - Priority: HIGH
   - Due Date: Tomorrow

4. User clicks "Save"
   → Frontend calls: createTask("Buy groceries", {
       categoryId: "personal-id",
       priority: "HIGH",
       dueDate: tomorrow
     })

5. Database:
   INSERT INTO tasks (id, title, category_id, priority, ...)
   VALUES (uuid(), "Buy groceries", "personal-id", "HIGH", ...)

6. Success!
   → Task appears in UI
   → Persisted to device storage
   → Survives app restart
```

---

## 🔗 **Relationships Flow**

```
Categories                    Tasks
┌─────────────┐             ┌─────────────┐
│ Work        │──────┐      │ Task 1      │───┐
│ Personal    │      │      │ Task 2      │   │
│ Shopping    │      │      │ Task 3      │   │
└─────────────┘      │      └─────────────┘   │
                     │                         │
                     │ category_id             │
                     └─────────────────────────┘

All belong to ONE user (this device)
```

**Query Example:**

```typescript
// Get tasks with their category info
const tasksWithCategories = await getTasksWithCategories()

// Returns:
[
  {
    task: { id: "...", title: "Task 1", categoryId: "work-id", ... },
    category: { id: "work-id", name: "Work", color: "#3B82F6" }
  },
  {
    task: { id: "...", title: "Task 2", categoryId: null, ... },
    category: null  // No category
  }
]
```

---

## 📊 **Data Isolation**

### Current Setup (Local MVP):

```
Device A:
  └── todo.db
      ├── categories: [Work, Personal]
      └── tasks: [Task 1, Task 2, Task 3]

Device B:
  └── todo.db
      ├── categories: [Shopping, Health]
      └── tasks: [Task A, Task B]

Each device has its own database file!
No data sharing between devices.
```

### Future with Backend API:

```
Device A ──┐
           ├──> Backend API (PostgreSQL)
Device B ──┤      └──> users table
           │           ├── User 1's data
Device C ──┘           └── User 2's data

Then you'll add:
- userId columns back
- User authentication
- Data sync across devices
```

---

## 🚀 **Key Advantages of This Approach**

✅ **Simpler code** - No user management logic
✅ **Faster development** - Focus on Todo features
✅ **Works offline** - All data stored locally
✅ **No auth complexity** - Just CRUD operations
✅ **Easy to upgrade** - Add users table later when needed

---

## 🔄 **Migration Path (When Adding Backend)**

### Step 1: Add users table back

```typescript
// Add to schema.ts
export const users = sqliteTable("users", { ... })
```

### Step 2: Add userId to existing tables

```sql
ALTER TABLE categories ADD COLUMN user_id TEXT;
ALTER TABLE tasks ADD COLUMN user_id TEXT;
```

### Step 3: Migrate existing data

```typescript
// Set all existing data to a default user
UPDATE categories SET user_id = 'default-user-id';
UPDATE tasks SET user_id = 'default-user-id';
```

### Step 4: Update functions

```typescript
// Change from:
createTask("Title");

// To:
createTask(userId, "Title");
```

---

## 💡 **Summary**

**Without Users Table:**

- ✅ Single user per device (the device owner)
- ✅ All categories belong to that device
- ✅ All tasks belong to that device
- ✅ No filtering by user needed
- ✅ Simpler queries and code
- ✅ Perfect for local MVP

**The flow is:**

1. App starts → Database initializes
2. User creates/reads/updates/deletes → Direct DB operations
3. No user authentication or filtering
4. Everything is device-specific

**When you add backend:**

- Add users table
- Add userId columns
- Add authentication
- Filter queries by userId
- Sync across devices

This approach lets you **build fast now, scale later**! 🚀
