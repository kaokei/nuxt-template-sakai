// 小程序码/链接生成工具 — Mock 数据

/** 模拟小程序列表 */
export const MINI_APP_LIST = [
  { id: 'wx001', name: '演示商城', appid: 'wxabc123def456789' },
  { id: 'wx002', name: '内部管理系统', appid: 'wxghi789jkl012345' },
  { id: 'wx003', name: '客户服务助手', appid: 'wxmno345pqr678901' },
];

/** 占位二维码 SVG */
export function createMockQRImage(label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="430" height="430" viewBox="0 0 430 430">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.1"/>
        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:0.1"/>
      </linearGradient>
    </defs>
    <rect width="430" height="430" fill="url(#bg)" rx="16"/>
    <rect x="20" y="20" width="390" height="390" fill="white" stroke="#e2e8f0" stroke-width="2" rx="12"/>
    <rect x="80" y="120" width="270" height="270" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="6,6" rx="8"/>
    <circle cx="215" cy="255" r="50" fill="#667eea" opacity="0.15"/>
    <circle cx="215" cy="255" r="30" fill="#667eea" opacity="0.3"/>
    <circle cx="215" cy="255" r="12" fill="#667eea"/>
    <text x="215" y="180" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#475569" font-weight="bold">${label}</text>
    <text x="215" y="340" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#94a3b8">小程序码 · 占位图</text>
    <text x="215" y="370" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#cbd5e1">实际使用时替换为真实接口</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
