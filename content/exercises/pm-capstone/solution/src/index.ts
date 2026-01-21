// Solution: Task Manager Capstone

type Priority = "low" | "medium" | "high";
type TaskStatus = "todo" | "in_progress" | "done";

interface Task {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: Date;
  completedAt?: Date;
}

interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}

class TaskManager {
  private tasks: Task[] = [];
  private nextId: number = 1;

  addTask(title: string, priority: Priority): Task {
    const task: Task = {
      id: this.nextId++,
      title,
      priority,
      status: "todo",
      createdAt: new Date()
    };
    this.tasks.push(task);
    return task;
  }

  updateStatus(id: number, status: TaskStatus): Task | null {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return null;

    task.status = status;
    if (status === "done") {
      task.completedAt = new Date();
    } else {
      task.completedAt = undefined;
    }
    return task;
  }

  deleteTask(id: number): boolean {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }

  getTasks(): Task[] {
    return [...this.tasks];
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter(t => t.status === status);
  }

  getTasksByPriority(priority: Priority): Task[] {
    return this.tasks.filter(t => t.priority === priority);
  }

  getStats(): TaskStats {
    return {
      total: this.tasks.length,
      todo: this.tasks.filter(t => t.status === "todo").length,
      inProgress: this.tasks.filter(t => t.status === "in_progress").length,
      done: this.tasks.filter(t => t.status === "done").length
    };
  }
}

const priorityOrder: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2
};

function sortByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

function sortByDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

function filterOverdue(tasks: Task[], days: number): Task[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return tasks.filter(t =>
    t.status !== "done" && t.createdAt < cutoff
  );
}

export {
  Priority,
  TaskStatus,
  Task,
  TaskStats,
  TaskManager,
  sortByPriority,
  sortByDate,
  filterOverdue
};
