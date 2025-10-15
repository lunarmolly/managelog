import { setupWorker } from 'msw/browser';
import { handlers } from './handlers/auth';
import { statusHandlers } from './handlers/status';
import { projectHandlers } from './handlers/projects';

export const worker = setupWorker(...handlers, ...statusHandlers, ...projectHandlers);


