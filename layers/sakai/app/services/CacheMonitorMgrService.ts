import {
  type CacheMonitorInfo,
  CacheMonitorService,
} from '@sakai/services/CacheMonitorService';

@Injectable()
export class CacheMonitorMgrService {
  @Inject(CacheMonitorService)
  private cacheMonitorService!: CacheMonitorService;

  monitorInfo: CacheMonitorInfo | null = null;
  loading = false;

  /** 格式化数字 */
  formatNumber(n: number): string {
    if (n >= 10000) return `${(n / 10000).toFixed(1)} 万`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)} k`;
    return n.toLocaleString('zh-CN');
  }

  /** 格式化命中率 */
  formatHitRate(rate: number): string {
    return `${rate.toFixed(2)}%`;
  }

  /** 获取命中率颜色类（绿色高亮高命中率） */
  getHitRateClass(rate: number): string {
    if (rate >= 95) return 'text-green-500';
    if (rate >= 85) return 'text-yellow-500';
    return 'text-red-500';
  }

  async loadMonitorInfo(): Promise<void> {
    this.loading = true;
    try {
      this.monitorInfo = await this.cacheMonitorService.getMonitorInfo();
    } finally {
      this.loading = false;
    }
  }

  @autobind
  async refresh(): Promise<void> {
    await this.loadMonitorInfo();
  }
}
