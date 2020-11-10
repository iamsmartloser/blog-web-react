import store from 'storejs';

/**
 * 检测是否有 指定的 localStorage
 * @param key
 */
export const hasStore = (key: string): boolean => {

  return key?store.has(key):false;
};

/**
 * 设置当个 localStorage
 * @param key
 * @param value
 */
export const setStore = (key: string, value: string | object) => {
  store.set(key, value);
};

/**
 * 批量设置
 * @param payload { key: data, key1: data1 }
 */
export const setStoreAll = (payload: object) => {
  store.set(payload);
};

/**
 * 获取单个 localStorage
 * @param payload { key: data, key1: data1 }
 */
export const getStore = (key: string): any => {
  if (hasStore(key)) {
    return store.get(key);
  }
  return null;
};

/**
 * 删除指定的 localStorage
 * @param key
 */
export const removeStore = (key: string) => {
  store.remove(key);
};

/**
 * 清除所有的 localStorage
 */
export const clearStore = () => {
  store.clear();
};
