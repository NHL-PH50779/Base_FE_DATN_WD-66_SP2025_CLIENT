interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number;
}

export const cacheUtil = {
  set(key: string, data: any, ttlMinutes = 5) {
    const item: CacheItem = {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
  },

  get(key: string) {
    const cached = localStorage.getItem(`cache_${key}`);
    if (!cached) return null;

    const item: CacheItem = JSON.parse(cached);
    if (Date.now() - item.timestamp > item.ttl) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }
    return item.data;
  },

  clear(pattern?: string) {
    if (pattern) {
      Object.keys(localStorage).forEach(key => {
        if (key.includes(pattern)) {
          localStorage.removeItem(key);
        }
      });
    } else {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    }
  }
};