import { fakerZH_CN as faker } from '@faker-js/faker';

faker.seed(2026);

export function generateCacheMonitor() {
  const hits = faker.number.int({ min: 500000, max: 5000000 });
  const misses = faker.number.int({ min: 5000, max: 100000 });
  const hitRate = +((hits / (hits + misses)) * 100).toFixed(2);
  const dbSize = faker.number.int({ min: 5000, max: 200000 });

  const commandStats = [
    {
      command: 'get',
      calls: faker.number.int({ min: 500000, max: 3000000 }),
      usecPerCall: faker.number.float({ min: 0.5, max: 5, fractionDigits: 1 }),
    },
    {
      command: 'set',
      calls: faker.number.int({ min: 200000, max: 1000000 }),
      usecPerCall: faker.number.float({ min: 1, max: 8, fractionDigits: 1 }),
    },
    {
      command: 'del',
      calls: faker.number.int({ min: 50000, max: 300000 }),
      usecPerCall: faker.number.float({ min: 1, max: 6, fractionDigits: 1 }),
    },
    {
      command: 'expire',
      calls: faker.number.int({ min: 30000, max: 200000 }),
      usecPerCall: faker.number.float({ min: 0.5, max: 3, fractionDigits: 1 }),
    },
    {
      command: 'ttl',
      calls: faker.number.int({ min: 20000, max: 150000 }),
      usecPerCall: faker.number.float({ min: 0.3, max: 2, fractionDigits: 1 }),
    },
    {
      command: 'exists',
      calls: faker.number.int({ min: 40000, max: 250000 }),
      usecPerCall: faker.number.float({ min: 0.3, max: 2, fractionDigits: 1 }),
    },
    {
      command: 'hget',
      calls: faker.number.int({ min: 100000, max: 800000 }),
      usecPerCall: faker.number.float({ min: 0.5, max: 4, fractionDigits: 1 }),
    },
    {
      command: 'hset',
      calls: faker.number.int({ min: 50000, max: 400000 }),
      usecPerCall: faker.number.float({ min: 1, max: 7, fractionDigits: 1 }),
    },
    {
      command: 'lrange',
      calls: faker.number.int({ min: 30000, max: 200000 }),
      usecPerCall: faker.number.float({ min: 1, max: 10, fractionDigits: 1 }),
    },
    {
      command: 'lpush',
      calls: faker.number.int({ min: 20000, max: 150000 }),
      usecPerCall: faker.number.float({ min: 0.5, max: 5, fractionDigits: 1 }),
    },
    {
      command: 'zadd',
      calls: faker.number.int({ min: 10000, max: 100000 }),
      usecPerCall: faker.number.float({ min: 1, max: 8, fractionDigits: 1 }),
    },
    {
      command: 'zrange',
      calls: faker.number.int({ min: 15000, max: 120000 }),
      usecPerCall: faker.number.float({ min: 1, max: 12, fractionDigits: 1 }),
    },
    {
      command: 'sadd',
      calls: faker.number.int({ min: 8000, max: 80000 }),
      usecPerCall: faker.number.float({ min: 1, max: 6, fractionDigits: 1 }),
    },
    {
      command: 'smembers',
      calls: faker.number.int({ min: 10000, max: 90000 }),
      usecPerCall: faker.number.float({ min: 2, max: 15, fractionDigits: 1 }),
    },
    {
      command: 'keys',
      calls: faker.number.int({ min: 5000, max: 30000 }),
      usecPerCall: faker.number.float({ min: 50, max: 500, fractionDigits: 1 }),
    },
    {
      command: 'scan',
      calls: faker.number.int({ min: 8000, max: 50000 }),
      usecPerCall: faker.number.float({ min: 10, max: 100, fractionDigits: 1 }),
    },
  ].sort((a, b) => b.calls - a.calls);

  const detailInfo = [
    {
      key: 'redis_version',
      value: faker.helpers.arrayElement(['7.0.15', '7.2.4', '6.2.14']),
    },
    { key: 'redis_mode', value: 'standalone' },
    {
      key: 'os',
      value: faker.helpers.arrayElement([
        'Linux 5.15.0-91-generic x86_64',
        'Linux 6.1.0-13-amd64 x86_64',
      ]),
    },
    { key: 'arch_bits', value: '64' },
    {
      key: 'tcp_port',
      value: String(faker.number.int({ min: 6379, max: 6389 })),
    },
    {
      key: 'uptime_in_seconds',
      value: String(faker.number.int({ min: 86400 * 30, max: 86400 * 180 })),
    },
    {
      key: 'uptime_in_days',
      value: String(faker.number.int({ min: 30, max: 180 })),
    },
    {
      key: 'connected_clients',
      value: String(faker.number.int({ min: 10, max: 100 })),
    },
    { key: 'maxclients', value: '10000' },
    {
      key: 'used_memory_human',
      value: faker.helpers.arrayElement([
        '256.50M',
        '512.80M',
        '1.02G',
        '2.15G',
      ]),
    },
    {
      key: 'used_memory_peak_human',
      value: faker.helpers.arrayElement(['512.00M', '1.02G', '2.50G', '4.00G']),
    },
    {
      key: 'total_connections_received',
      value: String(faker.number.int({ min: 50000, max: 500000 })),
    },
    {
      key: 'total_commands_processed',
      value: String(faker.number.int({ min: 1000000, max: 10000000 })),
    },
    {
      key: 'instantaneous_ops_per_sec',
      value: String(faker.number.int({ min: 500, max: 10000 })),
    },
    { key: 'keyspace_hits', value: String(hits) },
    { key: 'keyspace_misses', value: String(misses) },
    { key: 'maxmemory', value: '4gb' },
    { key: 'maxmemory_policy', value: 'allkeys-lru' },
    { key: 'loading', value: '0' },
    {
      key: 'rdb_last_save_time',
      value: String(
        Math.floor(Date.now() / 1000) -
          faker.number.int({ min: 3600, max: 86400 }),
      ),
    },
  ];

  const opsPerSec = faker.number.int({ min: 500, max: 10000 });

  return {
    info: {
      version: detailInfo[0]!.value,
      mode: detailInfo[1]!.value,
      uptimeDays: parseInt(detailInfo[6]!.value, 10),
      port: parseInt(detailInfo[4]!.value, 10),
    },
    stats: {
      dbSize,
      usedMemory: detailInfo[9]!.value.replace(/[A-Z]/g, ''),
      usedMemoryHuman: detailInfo[9]!.value,
      hits,
      misses,
      hitRate,
    },
    perf: {
      connectedClients: parseInt(detailInfo[7]!.value, 10),
      totalCommandsProcessed: parseInt(detailInfo[12]!.value, 10),
      opsPerSec,
    },
    commandStats,
    detailInfo,
  };
}
