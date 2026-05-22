import { fakerZH_CN as faker } from '@faker-js/faker';

faker.seed(2026);

export function generateServerMonitor() {
  const cores = faker.number.int({ min: 4, max: 32 });
  const sysUsage = faker.number.float({ min: 5, max: 25, fractionDigits: 1 });
  const userUsage = faker.number.float({ min: 10, max: 50, fractionDigits: 1 });
  const idle =
    100 -
    sysUsage -
    userUsage -
    faker.number.float({ min: 0, max: 3, fractionDigits: 1 });
  const wait = +(100 - sysUsage - userUsage - idle).toFixed(1);

  const memoryTotal = faker.number.float({
    min: 16,
    max: 64,
    fractionDigits: 1,
  });
  const memoryUsed = faker.number.float({
    min: 4,
    max: memoryTotal * 0.7,
    fractionDigits: 1,
  });
  const memoryFree = +(memoryTotal - memoryUsed).toFixed(1);
  const memoryUsage = +((memoryUsed / memoryTotal) * 100).toFixed(1);

  const heapInit = faker.number.int({ min: 128, max: 512 });
  const heapMax = faker.number.int({ min: 1024, max: 4096 });
  const heapUsed = faker.number.int({ min: 200, max: heapMax * 0.8 });
  const uptimeMs = faker.number.int({ min: 86400000, max: 86400000 * 30 });

  const systemProperties = [
    {
      key: 'java.version',
      value: faker.helpers.arrayElement(['17.0.9', '21.0.1', '11.0.21']),
    },
    {
      key: 'java.vendor',
      value: faker.helpers.arrayElement([
        'Oracle Corporation',
        'Eclipse Adoptium',
        'Amazon.com Inc.',
      ]),
    },
    { key: 'java.home', value: '/usr/lib/jvm/java-17-openjdk-amd64' },
    { key: 'java.class.path', value: 'server.jar:lib/*' },
    { key: 'user.timezone', value: 'Asia/Shanghai' },
    { key: 'user.language', value: 'zh' },
    { key: 'user.country', value: 'CN' },
    { key: 'file.encoding', value: 'UTF-8' },
    {
      key: 'os.name',
      value: faker.helpers.arrayElement([
        'Linux',
        'Windows Server 2019',
        'Windows Server 2022',
      ]),
    },
    { key: 'os.arch', value: faker.helpers.arrayElement(['amd64', 'aarch64']) },
    {
      key: 'os.version',
      value: faker.helpers.arrayElement([
        '5.15.0-91-generic',
        '10.0.20348',
        '6.1.0-13-amd64',
      ]),
    },
    { key: 'sun.java.command', value: 'com.ruoyi.RuoYiApplication' },
    {
      key: 'server.port',
      value: String(faker.number.int({ min: 8080, max: 9999 })),
    },
    { key: 'spring.profiles.active', value: 'prod' },
    { key: 'logging.level.root', value: 'INFO' },
    { key: 'server.tomcat.threads.max', value: '200' },
    {
      key: 'spring.datasource.type',
      value: 'com.alibaba.druid.pool.DruidDataSource',
    },
    { key: 'spring.redis.host', value: '127.0.0.1' },
  ];

  return {
    cpu: { cores, sysUsage, userUsage, idle, wait },
    memory: {
      total: memoryTotal,
      used: memoryUsed,
      free: memoryFree,
      usage: memoryUsage,
    },
    jvm: {
      name: faker.helpers.arrayElement([
        'OpenJDK 64-Bit Server VM',
        'Java HotSpot(TM) 64-Bit Server VM',
      ]),
      version: systemProperties[0]!.value,
      vendor: systemProperties[1]!.value,
      startTime: new Date(Date.now() - uptimeMs).toISOString(),
      uptime: String(uptimeMs),
      home: systemProperties[2]!.value,
      heapInit,
      heapUsed,
      heapMax,
    },
    server: {
      hostName: faker.internet.domainWord(),
      osName: systemProperties[8]!.value,
      osArch: systemProperties[9]!.value,
      ipAddress: faker.internet.ipv4(),
    },
    systemProperties,
  };
}
