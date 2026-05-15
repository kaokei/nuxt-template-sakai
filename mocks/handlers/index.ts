import { menuHandlers } from './menus';
import { problemHandlers } from './problems';
import { userHandlers } from './users';

export const handlers = [...problemHandlers, ...userHandlers, ...menuHandlers];
