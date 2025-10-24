export type Id = string;

export function generateId(): Id {
  if (
    typeof globalThis.crypto !== 'undefined' &&
    'randomUUID' in globalThis.crypto
  ) {
    return globalThis.crypto.randomUUID();
  }
  return `id_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

type StorageDriver = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
};

class MemoryStorage implements StorageDriver {
  private store = new Map<string, string>();
  async getItem(key: string) {
    return this.store.get(key) ?? null;
  }
  async setItem(key: string, value: string) {
    this.store.set(key, value);
  }
  async removeItem(key: string) {
    this.store.delete(key);
  }
  async clear() {
    this.store.clear();
  }
}

class WebLocalStorage implements StorageDriver {
  private ls: Storage;
  constructor(ls: Storage) {
    this.ls = ls;
  }
  async getItem(key: string) {
    return this.ls.getItem(key);
  }
  async setItem(key: string, value: string) {
    this.ls.setItem(key, value);
  }
  async removeItem(key: string) {
    this.ls.removeItem(key);
  }
  async clear() {
    this.ls.clear();
  }
}

function getStorage(): StorageDriver {
  if (
    typeof window === 'undefined' ||
    typeof window.localStorage === 'undefined'
  ) {
    return new MemoryStorage();
  }
  return new WebLocalStorage(window.localStorage);
}

const storage = getStorage();

async function setItem<T>(path: string, data: T): Promise<T> {
  const body = JSON.stringify(data);
  await storage.setItem(path, body);
  return data;
}

async function getItem<T>(path: string): Promise<T | null> {
  const data = await storage.getItem(path);
  if (!data) return null;
  try {
    return JSON.parse(data) as T;
  } catch {
    await storage.removeItem(path);
    return null;
  }
}

export class Database {
  static async setDocument<T extends Record<string, any>>(
    path: string,
    data: T,
  ): Promise<T> {
    const res = await setItem(path, { ...data });
    return res;
  }

  static async getDocument<T>(path: string): Promise<T | null> {
    const data = await getItem<T>(path);
    return data;
  }

  static async eraseDocument(path: string): Promise<void> {
    await storage.removeItem(path);
  }

  static async set<T extends { id?: Id }>(
    collection: string,
    data: T,
  ): Promise<T & { id: Id }> {
    const docId = (data as any)?.id || generateId();
    const path = `${collection}/${docId}`;
    const res = await setItem(path, { ...data, id: docId });

    const items = (await getItem<Id[]>(collection)) || [];
    if (!items.includes(docId)) {
      items.push(docId);
      await setItem(collection, items);
    }

    return res;
  }

  static async getAll<T>(collection: string): Promise<(T & { id: Id })[]> {
    const items = (await getItem<Id[]>(collection)) || [];
    const promises = items.map(async (id) => {
      const data = await getItem<T & { id: Id }>(`${collection}/${id}`);
      return data;
    });
    const body = await Promise.all(promises);
    return (body.filter(Boolean) as (T & { id: Id })[]) || [];
  }

  static async erase(path: string): Promise<void> {
    const [collection, docId] = `${path}`.split('/');
    if (!collection || !docId) return;

    const items = (await getItem<Id[]>(collection)) || [];
    const idx = items.indexOf(docId);
    if (idx !== -1) {
      items.splice(idx, 1);
      await setItem(collection, items);
    }

    await storage.removeItem(path);
  }

  static async clear(): Promise<void> {
    await storage.clear();
  }

  static async clearCollection(collection: string): Promise<void> {
    const items = (await getItem<Id[]>(collection)) || [];
    for (const id of items) {
      await this.erase(`${collection}/${id}`);
    }
    await setItem(collection, []);
  }

  static async get<T>(path: string): Promise<T | null> {
    const response = await getItem<T>(path);
    return response;
  }
}

export const LocalDB = Database;
