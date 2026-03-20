// 定义搜索范围类型
export type SearchScope = 'all' | 'keys' | 'values';

// 定义基本的 JSON 值类型
type JSONPrimitive = string | number | boolean | null | undefined;
type JSONValue = JSONPrimitive | JSONArray | JSONObject;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface JSONArray extends Array<JSONValue> {}
interface JSONObject {
  [key: string]: JSONValue;
}

// 递归过滤函数的核心类型定义
type FuzzyFilterResult<T, Pattern extends string> = T extends JSONPrimitive
  ? FuzzyFilterPrimitive<T, Pattern>
  : T extends JSONArray
    ? FuzzyFilterArray<T, Pattern>
    : T extends JSONObject
      ? FuzzyFilterObject<T, Pattern>
      : never;

// ✅ 修复后的定义：原始值的过滤结果类型
type FuzzyFilterPrimitive<
  T extends JSONPrimitive,
  Pattern extends string,
> = T | null;

// 数组类型的过滤结果
type FuzzyFilterArray<T extends JSONArray, Pattern extends string> =
  FuzzyFilterArrayRecursive<T, Pattern> extends infer Result
    ? Result extends Array<infer U>
      ? U extends null
        ? never
        : U
      : Result
    : never;

type FuzzyFilterArrayRecursive<
  T extends JSONArray,
  Pattern extends string,
  Result extends JSONArray = [],
> = T extends [infer First, ...infer Rest]
  ? FuzzyFilterArrayRecursive<
      Rest extends JSONArray ? Rest : [],
      Pattern,
      [
        ...Result,
        First extends JSONValue ? FuzzyFilterResult<First, Pattern> : never,
      ]
    >
  : Result;

// 对象类型的过滤结果
type FuzzyFilterObject<T extends JSONObject, Pattern extends string> = {
  [K in keyof T as FuzzyFilterObjectKey<K, T[K], Pattern>]: FuzzyFilterResult<
    T[K],
    Pattern
  >;
};

// 对象键的过滤逻辑
type FuzzyFilterObjectKey<
  K extends PropertyKey,
  V extends JSONValue,
  Pattern extends string,
> =
  StringContains<Stringify<K>, Pattern> extends true
    ? K
    : FuzzyFilterResult<V, Pattern> extends null
      ? never
      : K;

// 字符串包含检查工具类型
type StringContains<
  Str extends string,
  Pattern extends string,
> = Pattern extends ''
  ? true
  : Str extends `${string}${Pattern}${string}`
    ? true
    : false;

// 将任意类型转换为字符串表示
type Stringify<T> = T extends string
  ? T
  : T extends number
    ? `${T}`
    : T extends boolean
      ? `${T}`
      : T extends null
        ? 'null'
        : T extends undefined
          ? 'undefined'
          : string;

export function fuzzyFilter<T extends JSONValue, Pattern extends string>(
  data: T,
  pattern: Pattern,
  searchScope: SearchScope = 'all',
): FuzzyFilterResult<T, Pattern> {
  if (pattern === '') {
    return data as FuzzyFilterResult<T, Pattern>;
  }

  const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedPattern, 'i');

  return _fuzzyFilter(data, regex, searchScope) as FuzzyFilterResult<
    T,
    Pattern
  >;
}

function _fuzzyFilter<T extends JSONValue, Pattern extends string>(
  data: T,
  regex: RegExp,
  searchScope: SearchScope = 'all',
): FuzzyFilterResult<T, Pattern> {
  // 处理原始值
  if (data === null || data === undefined || typeof data !== 'object') {
    if (searchScope === 'keys') {
      return null as FuzzyFilterResult<T, Pattern>;
    }
    return (regex.test(String(data)) ? data : null) as FuzzyFilterResult<
      T,
      Pattern
    >;
  }

  // 处理数组
  if (Array.isArray(data)) {
    const filteredArray = (data as JSONArray)
      .map((item) => _fuzzyFilter(item, regex, searchScope))
      .filter((item) => item !== null) as JSONArray;

    return (
      filteredArray.length > 0 ? filteredArray : null
    ) as FuzzyFilterResult<T, Pattern>;
  }

  // 处理对象
  const result: Partial<JSONObject> = {};
  let hasMatch = false;

  for (const key in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      const keyMatches = searchScope !== 'values' && regex.test(key);

      if (keyMatches) {
        // 键匹配时，保留整个属性
        result[key] = value;
        hasMatch = true;
      } else {
        // 键不匹配时，总是递归过滤值（可能子对象中有匹配的 key 或 value）
        const filteredValue = _fuzzyFilter(value, regex, searchScope);
        if (filteredValue !== null) {
          result[key] = filteredValue;
          hasMatch = true;
        }
      }
    }
  }

  return (hasMatch ? result : null) as FuzzyFilterResult<T, Pattern>;
}
