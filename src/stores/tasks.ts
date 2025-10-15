import { defineStore } from 'pinia';

export type Column = {
  id: string;
  name: string;
  color?: string;
  order: number;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  priority: boolean;
  deadline?: string;
  assignees: string[];
  creator: string;
  watchers: string[];
  order: number;
  timeTracking?: {
    totalMs: number;
    startedAt?: number;
  };
};

type TasksState = {
  companyId: string | null;
  projectId: string | null;
  columns: Column[];
  tasks: Record<string, Task[]>; // columnId -> tasks[]
  lastSeq: number;
  optimisticQueue: Array<{ id: string; action: string; data: any }>;
};

export const useTasksStore = defineStore('tasks', {
  state: (): TasksState => ({
    companyId: null,
    projectId: null,
    columns: [],
    tasks: {},
    lastSeq: 0,
    optimisticQueue: [],
  }),
  actions: {
    setContext(companyId: string, projectId: string) {
      this.companyId = companyId;
      this.projectId = projectId;
    },
    setColumns(columns: Column[]) {
      this.columns = columns.sort((a, b) => a.order - b.order);
    },
    setTasksForColumn(columnId: string, tasks: Task[]) {
      this.tasks[columnId] = tasks.sort((a, b) => a.order - b.order);
    },
    addTask(task: Task) {
      if (!this.tasks[task.columnId]) this.tasks[task.columnId] = [];
      this.tasks[task.columnId].push(task);
      this.tasks[task.columnId].sort((a, b) => a.order - b.order);
    },
    updateTask(taskId: string, updates: Partial<Task>) {
      for (const columnId in this.tasks) {
        const task = this.tasks[columnId].find(t => t.id === taskId);
        if (task) {
          Object.assign(task, updates);
          break;
        }
      }
    },
    moveTask(taskId: string, fromColumnId: string, toColumnId: string, newOrder: number) {
      const fromTasks = this.tasks[fromColumnId] || [];
      const task = fromTasks.find(t => t.id === taskId);
      if (!task) return;
      
      // Remove from source
      this.tasks[fromColumnId] = fromTasks.filter(t => t.id !== taskId);
      
      // Add to target
      if (!this.tasks[toColumnId]) this.tasks[toColumnId] = [];
      task.columnId = toColumnId;
      task.order = newOrder;
      this.tasks[toColumnId].push(task);
      this.tasks[toColumnId].sort((a, b) => a.order - b.order);
    },
    reorderTasks(columnId: string, taskIds: string[]) {
      if (!this.tasks[columnId]) return;
      const tasks = this.tasks[columnId];
      const reordered = taskIds.map((id, index) => {
        const task = tasks.find(t => t.id === id);
        if (task) task.order = index;
        return task;
      }).filter(Boolean) as Task[];
      this.tasks[columnId] = reordered;
    },
    updateLastSeq(seq: number) {
      this.lastSeq = Math.max(this.lastSeq, seq);
    },
    addOptimisticAction(id: string, action: string, data: any) {
      this.optimisticQueue.push({ id, action, data });
    },
    removeOptimisticAction(id: string) {
      this.optimisticQueue = this.optimisticQueue.filter(item => item.id !== id);
    },
    clearContext() {
      this.companyId = null;
      this.projectId = null;
      this.columns = [];
      this.tasks = {};
      this.lastSeq = 0;
      this.optimisticQueue = [];
    },
  },
});
