export const CDN = 'https://cdn.kaokei.com';
export const CDN_NPM = 'https://cdn.kaokei.com/npm';

// 分页查询的默认参数key
export const QUERY_KEY_FOR_MODEL = 'q';

// 8-18位，至少包含数字和字母
export const PASSWORD_PATTERN = /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,18}$/;

// 性别选项
export const SEX_OPTIONS = [
  { label: '保密', value: 'secrecy' },
  { label: '男生', value: 'boy' },
  { label: '女生', value: 'girl' },
];

// content align
export const CONTENT_ALIGN = {
  START: { align: 'start' },
  CENTER: { align: 'center' },
  END: { align: 'end' },
} as const;

// 常见编码选项
export const COMMON_ENCODING_OPTIONS = [
  { label: 'UTF-8', value: 'utf-8' },
  { label: 'Base64', value: 'base64' },
  { label: 'Hex', value: 'hex' },
  { label: 'URL', value: 'url' },
];

// Base64 RFC选项
export const BASE64_RFC_OPTIONS = [
  { label: 'RFC 4648', value: 'rfc_4648' },
  { label: 'RFC 4648 URL Safe', value: 'rfc_4648_url_safe' },
  { label: 'RFC 2045 (MIME)', value: 'rfc_2045' },
  { label: 'RFC 2152 (UTF-7)', value: 'rfc_2152' },
  { label: 'RFC 3501 (IMAP)', value: 'rfc_3501' },
];

// 常见字符编码选项
export const COMMON_CHAR_ENCODING_OPTIONS = [
  { label: 'UTF-8', value: 'utf-8' },
  { label: 'UTF-16LE', value: 'utf-16le' },
  { label: 'UTF-16BE', value: 'utf-16be' },
  { label: 'IBM866', value: 'ibm866' },
  { label: 'ISO-8859-2', value: 'iso-8859-2' },
  { label: 'ISO-8859-3', value: 'iso-8859-3' },
  { label: 'ISO-8859-4', value: 'iso-8859-4' },
  { label: 'ISO-8859-5', value: 'iso-8859-5' },
  { label: 'ISO-8859-6', value: 'iso-8859-6' },
  { label: 'ISO-8859-7', value: 'iso-8859-7' },
  { label: 'ISO-8859-8', value: 'iso-8859-8' },
  { label: 'ISO-8859-8-I', value: 'iso-8859-8-i' },
  { label: 'ISO-8859-10', value: 'iso-8859-10' },
  { label: 'ISO-8859-13', value: 'iso-8859-13' },
  { label: 'ISO-8859-14', value: 'iso-8859-14' },
  { label: 'ISO-8859-15', value: 'iso-8859-15' },
  { label: 'ISO-8859-16', value: 'iso-8859-16' },
  { label: 'KOI8-R', value: 'koi8-r' },
  { label: 'KOI8-U', value: 'koi8-u' },
  { label: 'macintosh', value: 'macintosh' },
  { label: 'Windows-874', value: 'windows-874' },
  { label: 'Windows-1250', value: 'windows-1250' },
  { label: 'Windows-1251', value: 'windows-1251' },
  { label: 'Windows-1252', value: 'windows-1252' },
  { label: 'Windows-1253', value: 'windows-1253' },
  { label: 'Windows-1254', value: 'windows-1254' },
  { label: 'Windows-1255', value: 'windows-1255' },
  { label: 'Windows-1256', value: 'windows-1256' },
  { label: 'Windows-1257', value: 'windows-1257' },
  { label: 'Windows-1258', value: 'windows-1258' },
  { label: 'x-mac-cyrillic', value: 'x-mac-cyrillic' },
  { label: 'GBK', value: 'gbk' },
  { label: 'gb18030', value: 'gb18030' },
  { label: 'Big5', value: 'big5' },
  { label: 'EUC-JP', value: 'euc-jp' },
  { label: 'ISO-2022-JP', value: 'iso-2022-jp' },
  { label: 'Shift_JIS', value: 'shift_jis' },
  { label: 'EUC-KR', value: 'euc-kr' },
  { label: 'x-user-defined', value: 'x-user-defined' },
];
// 输入字符编码选项
export const INPUT_ENCODING_OPTIONS = [
  { label: 'Hex', value: 'hex' },
  { label: 'Base64', value: 'base64' },
  ...COMMON_CHAR_ENCODING_OPTIONS,
];
// 输出字符编码选项
export const OUTPUT_ENCODING_OPTIONS = [
  { label: 'Hex (Lower Case)', value: 'hex' },
  { label: 'Hex (Upper Case)', value: 'hex_upper' },
  { label: 'Base64', value: 'base64' },
  ...COMMON_CHAR_ENCODING_OPTIONS,
];

// html entity mode
export const HTML_ENTITY_MODE_OPTIONS = [
  { label: 'html保留字符', value: 'specialChars' },
  { label: 'html保留字符+非ASCII字符', value: 'nonAscii' },
  { label: '非ASCII可打印字符', value: 'nonAsciiPrintableOnly' },
  { label: 'html保留字符+非ASCII可打印字符', value: 'nonAsciiPrintable' },
  { label: '几乎所有字符', value: 'extensive' },
];
