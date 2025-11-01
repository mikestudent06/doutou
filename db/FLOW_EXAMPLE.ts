/**
 * Complete Flow Example - How the App Works Without Users
 * 
 * This file demonstrates the actual flow from app start to CRUD operations
 */

import { initDatabase, getDbInstance } from "./index";
import { createTask, getAllTasks, updateTask, deleteTask } from "./example";
import { createCategory, getAllCategories } from "./example";

// ============================================
// STEP 1: App Initialization (happens in _layout.tsx)
// ============================================

async function appStartup() {
  console.log("🚀 App Starting...");
  
  // Database auto-initializes via useDatabase hook
  // This creates the database file and tables if they don't exist
  await initDatabase();
  
  console.log("✅ Database ready!");
  console.log("📱 Device is the 'user' - no authentication needed");
}

// ============================================
// STEP 2: User Creates a Category
// ============================================

async function userCreatesCategory() {
  console.log("\n📁 User clicks 'Add Category'");
  
  // No userId needed - category belongs to this device
  const workCategory = await createCategory("Work", "#FF5733");
  const personalCategory = await createCategory("Personal", "#33FF57");
  
  console.log("✅ Categories created:", {
    work: workCategory.name,
    personal: personalCategory.name
  });
  
  return { workCategory, personalCategory };
}

// ============================================
// STEP 3: User Creates Tasks
// ============================================

async function userCreatesTasks(categories: { workCategory: any; personalCategory: any }) {
  console.log("\n📝 User creates tasks");
  
  // Task 1: With category
  const task1 = await createTask("Finish MVP", {
    description: "Complete the Todo app MVP",
    priority: "HIGH",
    categoryId: categories.workCategory.id,
    dueDate: new Date("2024-12-31")
  });
  
  // Task 2: Without category
  const task2 = await createTask("Buy groceries", {
    priority: "MEDIUM",
    categoryId: categories.personalCategory.id
  });
  
  // Task 3: Standalone task
  const task3 = await createTask("Call dentist");
  
  console.log("✅ Tasks created:", [task1.title, task2.title, task3.title]);
  
  return { task1, task2, task3 };
}

// ============================================
// STEP 4: User Views Tasks (App UI)
// ============================================

async function userViewsTasks() {
  console.log("\n👀 User opens app - loading tasks");
  
  // Get ALL tasks for this device (no user filtering)
  const allTasks = await getAllTasks();
  
  console.log(`📋 Found ${allTasks.length} tasks on this device`);
  
  // Filter by status
  const todoTasks = await getAllTasks({ status: "TODO" });
  const doneTasks = await getAllTasks({ status: "DONE" });
  
  console.log(`  - TODO: ${todoTasks.length} tasks`);
  console.log(`  - DONE: ${doneTasks.length} tasks`);
  
  return allTasks;
}

// ============================================
// STEP 5: User Updates Task (checks it off)
// ============================================

async function userCompletesTask(taskId: string) {
  console.log("\n✅ User checks off a task");
  
  // Mark as done
  const updated = await updateTask(taskId, {
    status: "DONE",
    completedAt: new Date()
  });
  
  console.log(`✅ Task "${updated.title}" marked as DONE`);
  
  return updated;
}

// ============================================
// STEP 6: User Deletes Task
// ============================================

async function userDeletesTask(taskId: string) {
  console.log("\n🗑️ User deletes a task");
  
  await deleteTask(taskId);
  
  console.log("✅ Task deleted");
}

// ============================================
// STEP 7: User Views Categories
// ============================================

async function userViewsCategories() {
  console.log("\n📁 User views categories");
  
  // Get ALL categories for this device
  const categories = await getAllCategories();
  
  console.log(`📂 Found ${categories.length} categories:`, 
    categories.map(c => c.name)
  );
  
  return categories;
}

// ============================================
// COMPLETE FLOW EXAMPLE
// ============================================

export async function completeFlowExample() {
  console.log("=".repeat(50));
  console.log("COMPLETE APP FLOW EXAMPLE");
  console.log("=".repeat(50));
  
  try {
    // Step 1: App starts
    await appStartup();
    
    // Step 2: User creates categories
    const categories = await userCreatesCategory();
    
    // Step 3: User creates tasks
    const tasks = await userCreatesTasks(categories);
    
    // Step 4: User views tasks
    const allTasks = await userViewsTasks();
    
    // Step 5: User completes a task
    await userCompletesTask(tasks.task1.id);
    
    // Step 6: User views updated list
    await userViewsTasks();
    
    // Step 7: User views categories
    await userViewsCategories();
    
    // Step 8: User deletes a task (optional)
    // await userDeletesTask(tasks.task3.id);
    
    console.log("\n" + "=".repeat(50));
    console.log("✅ Flow complete!");
    console.log("=".repeat(50));
    
  } catch (error) {
    console.error("❌ Error in flow:", error);
  }
}

// ============================================
// KEY TAKEAWAYS
// ============================================

/**
 * Without Users Table:
 * 
 * 1. ✅ No authentication needed
 * 2. ✅ No user_id in queries
 * 3. ✅ All data belongs to device
 * 4. ✅ Simpler code paths
 * 5. ✅ Faster development
 * 
 * Example differences:
 * 
 * WITH users:
 *   - createTask(userId, "Title")
 *   - getAllTasks(userId)
 *   - Need to manage user sessions
 * 
 * WITHOUT users (current):
 *   - createTask("Title")
 *   - getAllTasks()
 *   - Device = user
 * 
 * When you add backend:
 *   1. Add users table
 *   2. Add userId columns
 *   3. Add authentication
 *   4. Update all functions to include userId
 *   5. Sync data across devices
 */

