import { HttpResponse, delay, http } from 'msw';
import { BUCKETS } from '../data/buckets';

export const bucketHandlers = [
  http.get('/api/oss/buckets', async () => {
    await delay(200);
    return HttpResponse.json(BUCKETS);
  }),
];
