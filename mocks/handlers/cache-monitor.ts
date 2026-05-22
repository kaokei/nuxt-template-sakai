import { HttpResponse, delay, http } from 'msw';
import { generateCacheMonitor } from '../data/cache-monitor';

let cacheMonitor = generateCacheMonitor();

export const cacheMonitorHandlers = [
  http.get('/api/cache-monitor', async () => {
    await delay(300);
    return HttpResponse.json(cacheMonitor);
  }),
];
