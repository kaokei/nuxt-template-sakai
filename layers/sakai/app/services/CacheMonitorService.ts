/** Redis 基础信息 */
export interface RedisInfo {
  version: string;
  mode: string;
  uptimeDays: number;
  port: number;
}

/** Redis 统计信息 */
export interface RedisStats {
  dbSize: number;
  usedMemory: string;
  usedMemoryHuman: string;
  hits: number;
  misses: number;
  hitRate: number;
}

/** Redis 性能指标 */
export interface RedisPerf {
  connectedClients: number;
  totalCommandsProcessed: number;
  opsPerSec: number;
}

/** Redis 命令统计 */
export interface RedisCommandStat {
  command: string;
  calls: number;
  usecPerCall: number;
}

/** Redis 详细信息项 */
export interface RedisDetail {
  key: string;
  value: string;
}

/** 缓存监控全量信息 */
export interface CacheMonitorInfo {
  info: RedisInfo;
  stats: RedisStats;
  perf: RedisPerf;
  commandStats: RedisCommandStat[];
  detailInfo: RedisDetail[];
}

@Injectable()
export class CacheMonitorService {
  async getMonitorInfo(): Promise<CacheMonitorInfo> {
    return $fetch<CacheMonitorInfo>('/api/cache-monitor');
  }
}
