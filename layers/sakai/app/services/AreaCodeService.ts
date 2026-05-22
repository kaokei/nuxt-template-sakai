import type { AreaCode } from '~/types/area-code';

export interface AreaCodeQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
  regionName?: string;
  code?: string;
  continent?: string;
  enabled?: boolean;
}

export interface PageResult<T> {
  data: T[];
  total: number;
}

// 预设验证规则模板
export const PHONE_RULE_TEMPLATES: { label: string; rule: string }[] = [
  { label: '中国大陆 11位', rule: '^1[3-9]\\d{9}$' },
  { label: '通用 7-15位', rule: '^\\d{7,15}$' },
  { label: '美国/加拿大 10位', rule: '^\\d{10}$' },
  { label: '英国 10-11位', rule: '^\\d{10,11}$' },
  { label: '日本 10-11位', rule: '^\\d{10,11}$' },
  { label: '印度 10位', rule: '^\\d{10}$' },
  { label: '巴西 10-11位', rule: '^\\d{10,11}$' },
  { label: '澳大利亚 9-10位', rule: '^\\d{9,10}$' },
];

// Mock 数据
const mockData: AreaCode[] = [
  {
    id: '1',
    code: '86',
    regionName: '中国大陆',
    countryCode: 'CN',
    englishName: 'China',
    continent: '亚洲',
    validationRule: '^1[3-9]\\d{9}$',
    enabled: true,
    sort: 1,
    remark: '',
  },
  {
    id: '2',
    code: '852',
    regionName: '中国香港',
    countryCode: 'HK',
    englishName: 'Hong Kong',
    continent: '亚洲',
    validationRule: '^\\d{8}$',
    enabled: true,
    sort: 2,
    remark: '',
  },
  {
    id: '3',
    code: '853',
    regionName: '中国澳门',
    countryCode: 'MO',
    englishName: 'Macau',
    continent: '亚洲',
    validationRule: '^\\d{8}$',
    enabled: true,
    sort: 3,
    remark: '',
  },
  {
    id: '4',
    code: '886',
    regionName: '中国台湾',
    countryCode: 'TW',
    englishName: 'Taiwan',
    continent: '亚洲',
    validationRule: '^\\d{9,10}$',
    enabled: true,
    sort: 4,
    remark: '',
  },
  {
    id: '5',
    code: '81',
    regionName: '日本',
    countryCode: 'JP',
    englishName: 'Japan',
    continent: '亚洲',
    validationRule: '^\\d{10,11}$',
    enabled: true,
    sort: 10,
    remark: '',
  },
  {
    id: '6',
    code: '82',
    regionName: '韩国',
    countryCode: 'KR',
    englishName: 'South Korea',
    continent: '亚洲',
    validationRule: '^\\d{10,11}$',
    enabled: true,
    sort: 11,
    remark: '',
  },
  {
    id: '7',
    code: '65',
    regionName: '新加坡',
    countryCode: 'SG',
    englishName: 'Singapore',
    continent: '亚洲',
    validationRule: '^\\d{8}$',
    enabled: true,
    sort: 12,
    remark: '',
  },
  {
    id: '8',
    code: '60',
    regionName: '马来西亚',
    countryCode: 'MY',
    englishName: 'Malaysia',
    continent: '亚洲',
    validationRule: '^\\d{9,10}$',
    enabled: true,
    sort: 13,
    remark: '',
  },
  {
    id: '9',
    code: '91',
    regionName: '印度',
    countryCode: 'IN',
    englishName: 'India',
    continent: '亚洲',
    validationRule: '^\\d{10}$',
    enabled: true,
    sort: 14,
    remark: '',
  },
  {
    id: '10',
    code: '63',
    regionName: '菲律宾',
    countryCode: 'PH',
    englishName: 'Philippines',
    continent: '亚洲',
    validationRule: '^\\d{10}$',
    enabled: true,
    sort: 15,
    remark: '',
  },
  {
    id: '11',
    code: '66',
    regionName: '泰国',
    countryCode: 'TH',
    englishName: 'Thailand',
    continent: '亚洲',
    validationRule: '^\\d{9,10}$',
    enabled: true,
    sort: 16,
    remark: '',
  },
  {
    id: '12',
    code: '84',
    regionName: '越南',
    countryCode: 'VN',
    englishName: 'Vietnam',
    continent: '亚洲',
    validationRule: '^\\d{9,10}$',
    enabled: true,
    sort: 17,
    remark: '',
  },
  {
    id: '13',
    code: '62',
    regionName: '印度尼西亚',
    countryCode: 'ID',
    englishName: 'Indonesia',
    continent: '亚洲',
    validationRule: '^\\d{9,12}$',
    enabled: true,
    sort: 18,
    remark: '',
  },
  {
    id: '14',
    code: '1',
    regionName: '美国',
    countryCode: 'US',
    englishName: 'United States',
    continent: '北美',
    validationRule: '^\\d{10}$',
    enabled: true,
    sort: 30,
    remark: '',
  },
  {
    id: '15',
    code: '1',
    regionName: '加拿大',
    countryCode: 'CA',
    englishName: 'Canada',
    continent: '北美',
    validationRule: '^\\d{10}$',
    enabled: true,
    sort: 31,
    remark: '',
  },
  {
    id: '16',
    code: '52',
    regionName: '墨西哥',
    countryCode: 'MX',
    englishName: 'Mexico',
    continent: '北美',
    validationRule: '^\\d{10}$',
    enabled: false,
    sort: 32,
    remark: '',
  },
  {
    id: '17',
    code: '44',
    regionName: '英国',
    countryCode: 'GB',
    englishName: 'United Kingdom',
    continent: '欧洲',
    validationRule: '^\\d{10,11}$',
    enabled: true,
    sort: 50,
    remark: '',
  },
  {
    id: '18',
    code: '33',
    regionName: '法国',
    countryCode: 'FR',
    englishName: 'France',
    continent: '欧洲',
    validationRule: '^\\d{9}$',
    enabled: true,
    sort: 51,
    remark: '',
  },
  {
    id: '19',
    code: '49',
    regionName: '德国',
    countryCode: 'DE',
    englishName: 'Germany',
    continent: '欧洲',
    validationRule: '^\\d{10,11}$',
    enabled: true,
    sort: 52,
    remark: '',
  },
  {
    id: '20',
    code: '39',
    regionName: '意大利',
    countryCode: 'IT',
    englishName: 'Italy',
    continent: '欧洲',
    validationRule: '^\\d{9,10}$',
    enabled: true,
    sort: 53,
    remark: '',
  },
  {
    id: '21',
    code: '7',
    regionName: '俄罗斯',
    countryCode: 'RU',
    englishName: 'Russia',
    continent: '欧洲',
    validationRule: '^\\d{10}$',
    enabled: false,
    sort: 54,
    remark: '',
  },
  {
    id: '22',
    code: '34',
    regionName: '西班牙',
    countryCode: 'ES',
    englishName: 'Spain',
    continent: '欧洲',
    validationRule: '^\\d{9}$',
    enabled: false,
    sort: 55,
    remark: '',
  },
  {
    id: '23',
    code: '55',
    regionName: '巴西',
    countryCode: 'BR',
    englishName: 'Brazil',
    continent: '南美',
    validationRule: '^\\d{10,11}$',
    enabled: true,
    sort: 70,
    remark: '',
  },
  {
    id: '24',
    code: '54',
    regionName: '阿根廷',
    countryCode: 'AR',
    englishName: 'Argentina',
    continent: '南美',
    validationRule: '^\\d{10}$',
    enabled: false,
    sort: 71,
    remark: '',
  },
  {
    id: '25',
    code: '27',
    regionName: '南非',
    countryCode: 'ZA',
    englishName: 'South Africa',
    continent: '非洲',
    validationRule: '^\\d{9}$',
    enabled: false,
    sort: 90,
    remark: '',
  },
  {
    id: '26',
    code: '20',
    regionName: '埃及',
    countryCode: 'EG',
    englishName: 'Egypt',
    continent: '非洲',
    validationRule: '^\\d{10}$',
    enabled: false,
    sort: 91,
    remark: '',
  },
  {
    id: '27',
    code: '234',
    regionName: '尼日利亚',
    countryCode: 'NG',
    englishName: 'Nigeria',
    continent: '非洲',
    validationRule: '^\\d{10}$',
    enabled: false,
    sort: 92,
    remark: '',
  },
  {
    id: '28',
    code: '61',
    regionName: '澳大利亚',
    countryCode: 'AU',
    englishName: 'Australia',
    continent: '大洋洲',
    validationRule: '^\\d{9,10}$',
    enabled: true,
    sort: 110,
    remark: '',
  },
  {
    id: '29',
    code: '64',
    regionName: '新西兰',
    countryCode: 'NZ',
    englishName: 'New Zealand',
    continent: '大洋洲',
    validationRule: '^\\d{8,10}$',
    enabled: false,
    sort: 111,
    remark: '',
  },
  {
    id: '30',
    code: '971',
    regionName: '阿联酋',
    countryCode: 'AE',
    englishName: 'United Arab Emirates',
    continent: '亚洲',
    validationRule: '^\\d{9}$',
    enabled: false,
    sort: 19,
    remark: '',
  },
  {
    id: '31',
    code: '966',
    regionName: '沙特阿拉伯',
    countryCode: 'SA',
    englishName: 'Saudi Arabia',
    continent: '亚洲',
    validationRule: '^\\d{9}$',
    enabled: false,
    sort: 20,
    remark: '',
  },
  {
    id: '32',
    code: '93',
    regionName: '阿富汗',
    countryCode: 'AF',
    englishName: 'Afghanistan',
    continent: '亚洲',
    validationRule: '',
    enabled: false,
    sort: 21,
    remark: '',
  },
  {
    id: '33',
    code: '355',
    regionName: '阿尔巴尼亚',
    countryCode: 'AL',
    englishName: 'Albania',
    continent: '欧洲',
    validationRule: '',
    enabled: false,
    sort: 56,
    remark: '',
  },
  {
    id: '34',
    code: '213',
    regionName: '阿尔及利亚',
    countryCode: 'DZ',
    englishName: 'Algeria',
    continent: '非洲',
    validationRule: '',
    enabled: false,
    sort: 93,
    remark: '',
  },
  {
    id: '35',
    code: '244',
    regionName: '安哥拉',
    countryCode: 'AO',
    englishName: 'Angola',
    continent: '非洲',
    validationRule: '',
    enabled: false,
    sort: 94,
    remark: '',
  },
  {
    id: '36',
    code: '54',
    regionName: '阿根廷',
    countryCode: 'AR',
    englishName: 'Argentina',
    continent: '南美',
    validationRule: '',
    enabled: false,
    sort: 72,
    remark: '',
  },
];

let nextId = 37;

@Injectable()
export class AreaCodeService {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getList(
    params: AreaCodeQueryParams = {},
  ): Promise<PageResult<AreaCode>> {
    await this._delay();

    let list = [...mockData];

    // 搜索过滤
    if (params.regionName) {
      list = list.filter((item) =>
        item.regionName.includes(params.regionName!),
      );
    }
    if (params.code) {
      list = list.filter((item) => item.code.includes(params.code!));
    }
    if (params.continent) {
      list = list.filter((item) => item.continent === params.continent);
    }
    if (params.enabled !== undefined) {
      list = list.filter((item) => item.enabled === params.enabled);
    }

    // 排序
    const sortField = params.sortField || 'sort';
    const sortOrder = params.sortOrder ?? 1;
    list.sort((a, b) => {
      const aVal = a[sortField as keyof AreaCode];
      const bVal = b[sortField as keyof AreaCode];
      if (aVal == null || bVal == null) return 0;
      if (typeof aVal === 'string') {
        return sortOrder === 1
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }
      return sortOrder === 1
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    // 分页
    if (params.page && params.pageSize) {
      const page = params.page;
      const pageSize = params.pageSize;
      const start = (page - 1) * pageSize;
      const paged = list.slice(start, start + pageSize);
      return { data: paged, total: list.length };
    }

    return { data: list, total: list.length };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async create(data: Omit<AreaCode, 'id'>): Promise<AreaCode> {
    await this._delay();
    const newItem: AreaCode = { ...data, id: String(nextId++) };
    mockData.push(newItem);
    return newItem;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async update(id: string, data: Partial<AreaCode>): Promise<AreaCode> {
    await this._delay();
    const idx = mockData.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error('记录不存在');
    mockData[idx] = { ...mockData[idx], ...data } as AreaCode;
    return mockData[idx]!;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async delete(id: string): Promise<boolean> {
    await this._delay();
    const idx = mockData.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error('记录不存在');
    mockData.splice(idx, 1);
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async batchUpdate(ids: string[], data: Partial<AreaCode>): Promise<void> {
    await this._delay();
    for (const id of ids) {
      const idx = mockData.findIndex((item) => item.id === id);
      if (idx !== -1) {
        mockData[idx] = { ...mockData[idx], ...data } as AreaCode;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async checkExists(
    field: 'code' | 'regionName' | 'countryCode',
    value: string,
    excludeId?: string,
  ): Promise<boolean> {
    await this._delay();
    return mockData.some(
      (item) => item[field] === value && item.id !== excludeId,
    );
  }

  private _delay(ms = 200): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
