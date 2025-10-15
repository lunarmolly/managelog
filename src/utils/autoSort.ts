import type { Task } from '../stores/tasks';

/**
 * Автосортировка задач по правилам:
 * 1. Priority first (срочные сверху)
 * 2. Deadline (ближайшие к дедлайну сверху)
 * 3. No deadline last (без дедлайна внизу)
 */
export function autoSortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // 1. Priority first
    if (a.priority !== b.priority) {
      return a.priority ? -1 : 1;
    }
    
    // 2. Deadline (closer first)
    if (a.deadline && b.deadline) {
      const dateA = new Date(a.deadline).getTime();
      const dateB = new Date(b.deadline).getTime();
      return dateA - dateB;
    }
    
    // Tasks with deadline come before tasks without
    if (a.deadline && !b.deadline) return -1;
    if (!a.deadline && b.deadline) return 1;
    
    // 3. No deadline last (maintain original order)
    return 0;
  });
}

/**
 * Применить автосортировку к задачам в колонке и обновить их order
 */
export function applyAutoSortToColumn(tasks: Task[]): Task[] {
  const sorted = autoSortTasks(tasks);
  return sorted.map((task, index) => ({
    ...task,
    order: index,
  }));
}
