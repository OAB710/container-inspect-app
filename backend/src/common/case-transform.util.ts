const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  return Object.getPrototypeOf(value) === Object.prototype;
};

export const toSnakeCase = (value: string): string => {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
};

export const toCamelCase = (value: string): string => {
  return value.replace(/[_-]+([a-zA-Z0-9])/g, (_, group: string) => {
    return group.toUpperCase();
  });
};

export const mapKeysDeep = <T>(
  value: T,
  keyMapper: (key: string) => string,
): T => {
  if (Array.isArray(value)) {
    return value.map((item) => mapKeysDeep(item, keyMapper)) as T;
  }

  if (isPlainObject(value)) {
    const result: Record<string, unknown> = {};

    for (const [key, nestedValue] of Object.entries(value)) {
      result[keyMapper(key)] = mapKeysDeep(nestedValue, keyMapper);
    }

    return result as T;
  }

  return value;
};
