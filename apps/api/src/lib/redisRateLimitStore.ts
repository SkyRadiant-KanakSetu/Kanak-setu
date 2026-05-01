import { createClient } from 'redis';
import { RedisStore } from 'rate-limit-redis';

/**
 * Shared Redis-backed store for express-rate-limit so multiple API instances behind a
 * load balancer enforce one global budget per client IP (when REDIS_URL is set).
 */
export async function connectRedisRateLimitStore(url: string): Promise<RedisStore> {
  const client = createClient({ url });
  client.on('error', (err) => {
    console.error('[redis rate-limit]', err);
  });
  await client.connect();
  return new RedisStore({
    prefix: 'rl:kks:',
    sendCommand: (...args: string[]) => client.sendCommand(args),
  });
}
