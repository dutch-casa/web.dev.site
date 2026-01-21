// Capstone Project: Task Manager
//
// Build a complete task management system using everything you've learned!
//
// Requirements:
//
// 1. Define types:
//    - Priority: "low" | "medium" | "high"
//    - TaskStatus: "todo" | "in_progress" | "done"
//    - Task interface with: id, title, description?, priority, status, createdAt, completedAt?
//
// 2. TaskManager class with:
//    - private tasks array
//    - addTask(title, priority): Task - create and add a task
//    - updateStatus(id, status): Task | null - update task status
//    - deleteTask(id): boolean - remove a task
//    - getTasks(): Task[] - get all tasks
//    - getTasksByStatus(status): Task[] - filter by status
//    - getTasksByPriority(priority): Task[] - filter by priority
//    - getStats(): { total, todo, inProgress, done } - get task statistics
//
// 3. Utility functions:
//    - sortByPriority(tasks): Task[] - sort by priority (high first)
//    - sortByDate(tasks): Task[] - sort by createdAt (newest first)
//    - filterOverdue(tasks, days): Task[] - tasks older than X days that aren't done

// Define your types here:


// TaskManager class:
class TaskManager {
  // Your code here
}

// Utility functions:
function sortByPriority(tasks) {
  // Your code here
}

function sortByDate(tasks) {
  // Your code here
}

function filterOverdue(tasks, days) {
  // Your code here
}

export { TaskManager, sortByPriority, sortByDate, filterOverdue };
