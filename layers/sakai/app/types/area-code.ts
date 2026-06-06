export interface AreaCode {
  id: string;
  code: string;
  regionName: string;
  countryCode: string;
  englishName: string;
  continent: '亚洲' | '欧洲' | '北美' | '南美' | '非洲' | '大洋洲';
  validationRule: string;
  enabled: boolean;
  sort: number;
  remark: string;
}

export const CONTINENT_OPTIONS = [
  { label: '亚洲', value: '亚洲' as const },
  { label: '欧洲', value: '欧洲' as const },
  { label: '北美', value: '北美' as const },
  { label: '南美', value: '南美' as const },
  { label: '非洲', value: '非洲' as const },
  { label: '大洋洲', value: '大洋洲' as const },
];
