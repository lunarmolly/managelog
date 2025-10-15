import { http, HttpResponse, delay } from 'msw';
import type { Column, Task } from '../../stores/tasks';

let columns: Column[] = [
  { id: 'c1', name: 'Backlog', color: '#3b82f6', order: 0 },
  { id: 'c2', name: 'In Progress', color: '#f59e0b', order: 1 },
  { id: 'c3', name: 'Review', color: '#8b5cf6', order: 2 },
  { id: 'c4', name: 'Done', color: '#10b981', order: 3 },
];

let tasks: Task[] = [
  { id: 't1', title: 'Setup project', description: 'Initial setup', columnId: 'c1', priority: false, assignees: ['user1'], creator: 'user1', watchers: [], order: 0 },
  { id: 't2', title: 'Design UI', description: 'Create wireframes', columnId: 'c1', priority: true, deadline: '2024-01-15', assignees: ['user2'], creator: 'user1', watchers: ['user1'], order: 1 },
  { id: 't3', title: 'Implement auth', description: 'User authentication', columnId: 'c2', priority: false, assignees: ['user1'], creator: 'user1', watchers: [], order: 0 },
  { id: 't4', title: 'Write tests', description: 'Unit tests', columnId: 'c3', priority: false, assignees: ['user2'], creator: 'user1', watchers: [], order: 0 },
  { id: 't5', title: 'Deploy to prod', description: 'Production deployment', columnId: 'c4', priority: false, assignees: ['user1'], creator: 'user1', watchers: [], order: 0 },
];

let seq = 1;

export const projectHandlers = [
  http.get('/api/companies/:companyId/projects/:projectId/columns', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const cursor = url.searchParams.get('cursor');
    
    const startIndex = cursor ? parseInt(cursor) : 0;
    const endIndex = startIndex + limit;
    const result = columns.slice(startIndex, endIndex);
    
    return HttpResponse.json({
      columns: result,
      nextCursor: endIndex < columns.length ? endIndex.toString() : undefined,
    });
  }),

  http.get('/api/companies/:companyId/projects/:projectId/tasks', async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const columnId = url.searchParams.get('columnId');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const cursor = url.searchParams.get('cursor');
    
    let filteredTasks = columnId ? tasks.filter(t => t.columnId === columnId) : tasks;
    const startIndex = cursor ? parseInt(cursor) : 0;
    const endIndex = startIndex + limit;
    const result = filteredTasks.slice(startIndex, endIndex);
    
    return HttpResponse.json({
      tasks: result,
      nextCursor: endIndex < filteredTasks.length ? endIndex.toString() : undefined,
    });
  }),

  http.post('/api/companies/:companyId/projects/:projectId/columns', async ({ request }) => {
    await delay(300);
    const body = await request.json() as any;
    const column: Column = {
      id: `c${Date.now()}`,
      name: body.name,
      color: body.color,
      order: columns.length,
    };
    columns.push(column);
    return HttpResponse.json({ column });
  }),

  http.patch('/api/companies/:companyId/projects/:projectId/columns/:columnId', async ({ request, params }) => {
    await delay(200);
    const body = await request.json() as any;
    const column = columns.find(c => c.id === params.columnId);
    if (!column) return HttpResponse.json({ message: 'Column not found' }, { status: 404 });
    
    Object.assign(column, body);
    return HttpResponse.json({ column });
  }),

  http.delete('/api/companies/:companyId/projects/:projectId/columns/:columnId', async ({ params }) => {
    await delay(200);
    const columnId = params.columnId as string;
    columns = columns.filter(c => c.id !== columnId);
    tasks = tasks.filter(t => t.columnId !== columnId);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post('/api/companies/:companyId/projects/:projectId/tasks', async ({ request }) => {
    await delay(300);
    const body = await request.json() as any;
    const task: Task = {
      id: `t${Date.now()}`,
      title: body.title || 'New Task',
      description: body.description,
      columnId: body.columnId,
      priority: body.priority || false,
      deadline: body.deadline,
      assignees: body.assignees || [],
      creator: 'user1', // mock current user
      watchers: body.watchers || [],
      order: tasks.filter(t => t.columnId === body.columnId).length,
    };
    tasks.push(task);
    return HttpResponse.json({ task });
  }),

  http.patch('/api/companies/:companyId/projects/:projectId/tasks/:taskId', async ({ request, params }) => {
    await delay(200);
    const body = await request.json() as any;
    const task = tasks.find(t => t.id === params.taskId);
    if (!task) return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
    
    Object.assign(task, body);
    return HttpResponse.json({ task });
  }),

  http.delete('/api/companies/:companyId/projects/:projectId/tasks/:taskId', async ({ params }) => {
    await delay(200);
    const taskId = params.taskId as string;
    tasks = tasks.filter(t => t.id !== taskId);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post('/api/companies/:companyId/projects/:projectId/columns/:columnId/order', async ({ request, params }) => {
    await delay(200);
    const body = await request.json() as any;
    const columnId = params.columnId as string;
    const taskIds = body.taskIds as string[];
    
    // Update task orders
    taskIds.forEach((taskId, index) => {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        task.columnId = columnId;
        task.order = index;
      }
    });
    
    return HttpResponse.json({ ok: true, seq: ++seq });
  }),

  http.post('/api/companies/:companyId/projects/:projectId/columns/order', async ({ request }) => {
    await delay(200);
    const body = await request.json() as any;
    const columnIds = body.columnIds as string[];
    
    // Update column orders
    columnIds.forEach((columnId, index) => {
      const column = columns.find(c => c.id === columnId);
      if (column) column.order = index;
    });
    
    return HttpResponse.json({ ok: true, seq: ++seq });
  }),
];
