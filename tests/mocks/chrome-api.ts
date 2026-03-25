import { vi } from 'vitest';

type StorageMap = Record<string, unknown>;

const storageState: StorageMap = {};

const getWithDefaults = (defaults: StorageMap) => {
  const result: StorageMap = { ...defaults };
  for (const [key, value] of Object.entries(storageState)) {
    result[key] = value;
  }
  return result;
};

export const resetChromeStorage = () => {
  for (const key of Object.keys(storageState)) {
    delete storageState[key];
  }
};

const chromeMock = {
  runtime: {
    getManifest: vi.fn(() => ({ version: 'test' })),
  },
  storage: {
    sync: {
      get: vi.fn((keysOrDefaults?: unknown, callback?: (result: StorageMap) => void) => {
        let result: StorageMap;

        if (!keysOrDefaults) {
          result = { ...storageState };
        } else if (typeof keysOrDefaults === 'string') {
          result = {
            [keysOrDefaults]: storageState[keysOrDefaults],
          };
        } else if (Array.isArray(keysOrDefaults)) {
          result = Object.fromEntries(keysOrDefaults.map((key) => [key, storageState[key as string]]));
        } else {
          result = getWithDefaults(keysOrDefaults as StorageMap);
        }

        if (callback) {
          callback(result);
          return;
        }

        return Promise.resolve(result);
      }),
      set: vi.fn(async (items: StorageMap) => {
        Object.assign(storageState, items);
      }),
      remove: vi.fn(async (keyOrKeys: string | string[]) => {
        const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
        for (const key of keys) {
          delete storageState[key];
        }
      }),
      clear: vi.fn(async () => {
        resetChromeStorage();
      }),
    },
  },
};

vi.stubGlobal('chrome', chromeMock);

export default chromeMock;
