import { setupWorker } from 'msw/browser';
import { handlers } from './handlers/auth';
import { statusHandlers } from './handlers/status';

export const worker = setupWorker(...handlers, ...statusHandlers);


