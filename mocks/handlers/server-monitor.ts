import { HttpResponse, delay, http } from 'msw';
import { generateServerMonitor } from '../data/server-monitor';

let serverMonitor = generateServerMonitor();

export const serverMonitorHandlers = [
  http.get('/api/server-monitor', async () => {
    await delay(300);
    return HttpResponse.json(serverMonitor);
  }),
];
