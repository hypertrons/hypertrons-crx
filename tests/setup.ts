import { afterEach, vi } from 'vitest';
import { resetChromeStorage } from './mocks/chrome-api';

afterEach(() => {
  vi.restoreAllMocks();
  resetChromeStorage();
});
