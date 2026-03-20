export function pad(n: number) {
  return n < 10 ? `0${n}` : n;
}

export function hasOwn(obj: any, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function getUTCTimeZone() {
  const offset = new Date().getTimezoneOffset();
  const zone = offset / 60;
  if (zone > 0) {
    return `UTC${-zone}`;
  } else {
    return `UTC+${-zone}`;
  }
}

/**
 * 延迟执行
 * @param time number
 * @returns
 */
export function delay(time: number = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export function parseInt10(value: any) {
  if (value === void 0 || value === null) {
    return value;
  }
  return parseInt(value, 10);
}

/**
 * @param source Ref 响应式对象
 * @param keys 选择的属性key数组
 * @returns 新的computed对象
 */
export function pickComputed<T extends object, K extends readonly (keyof T)[]>(
  source: Ref<T>,
  keys: K,
) {
  return computed(() => {
    const result = {} as Pick<T, K[number]>;
    for (const key of keys) {
      result[key] = source.value[key];
    }
    return result;
  });
}
