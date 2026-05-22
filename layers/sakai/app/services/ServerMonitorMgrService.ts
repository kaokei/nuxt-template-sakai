import {
  type ServerMonitorInfo,
  ServerMonitorService,
} from '@sakai/services/ServerMonitorService';

@Injectable()
export class ServerMonitorMgrService {
  @Inject(ServerMonitorService)
  private serverMonitorService!: ServerMonitorService;

  monitorInfo: ServerMonitorInfo | null = null;
  loading = false;

  /** 格式化内存单位 (MB -> GB) */
  formatMemory(mb: number): string {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb.toFixed(0)} MB`;
  }

  /** 格式化百分比 */
  formatPercent(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  /** 格式化运行时长 (ms) */
  formatUptime(uptime: string): string {
    // uptime 格式为毫秒数的字符串
    const ms = parseInt(uptime, 10);
    if (isNaN(ms)) return uptime;

    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const parts: string[] = [];
    if (days > 0) parts.push(`${days} 天`);
    if (hours > 0) parts.push(`${hours} 小时`);
    if (minutes > 0) parts.push(`${minutes} 分钟`);
    return parts.join(' ') || '< 1 分钟';
  }

  async loadMonitorInfo(): Promise<void> {
    this.loading = true;
    try {
      this.monitorInfo = await this.serverMonitorService.getMonitorInfo();
    } finally {
      this.loading = false;
    }
  }

  @autobind
  async refresh(): Promise<void> {
    await this.loadMonitorInfo();
  }
}
