/** CPU 信息 */
export interface CpuInfo {
  cores: number;
  sysUsage: number;
  userUsage: number;
  idle: number;
  wait: number;
}

/** 内存信息 */
export interface MemoryInfo {
  total: number;
  used: number;
  free: number;
  usage: number;
}

/** JVM 信息 */
export interface JvmInfo {
  name: string;
  version: string;
  vendor: string;
  startTime: string;
  uptime: string;
  home: string;
  heapInit: number;
  heapUsed: number;
  heapMax: number;
}

/** 服务器信息 */
export interface ServerInfo {
  hostName: string;
  osName: string;
  osArch: string;
  ipAddress: string;
}

/** 系统属性 */
export interface SystemProperty {
  key: string;
  value: string;
}

/** 服务监控全量信息 */
export interface ServerMonitorInfo {
  cpu: CpuInfo;
  memory: MemoryInfo;
  jvm: JvmInfo;
  server: ServerInfo;
  systemProperties: SystemProperty[];
}

@Injectable()
export class ServerMonitorService {
  async getMonitorInfo(): Promise<ServerMonitorInfo> {
    return $fetch<ServerMonitorInfo>('/api/server-monitor');
  }
}
