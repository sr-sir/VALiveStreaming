export class ClientStorage {
  private storage: Storage;
  private _prefix = 'vitual-ads';
  private _expiredTime = 24 * 60 * 60 * 1000; //24 hours

  constructor(storageLocation: Storage = window.localStorage, prefix?: string) {
    this.storage = storageLocation;
    if (prefix) {
      this._prefix = prefix;
    }
  }

  public set<T = any>(key: string, val: T): T | void {
    if (val === undefined) {
      return this.remove(this.prefix(key));
    }
    this.storage.setItem(this.prefix(key), this.serialize(val));
    return val;
  }

  public get<T = any>(key: string, def?: T): T {
    const val = this.deserialize(this.storage.getItem(this.prefix(key)));
    return val === undefined ? def : val;
  }

  public has(key: string): boolean {
    return this.get(this.prefix(key)) !== undefined;
  }

  public remove(key: string): void {
    this.storage.removeItem(this.prefix(key));
  }

  public clear(): void {
    this.forEach((key, val) => {
      this.storage.removeItem(this.prefix(key));
    });
  }

  public getAll(): Record<string, any> {
    const ret: { [key: string]: any } = {};
    this.forEach((key, val) => {
      if (val) ret[key] = val;
    });
    return ret;
  }

  public clearExpired() {
    this.forEach((key, val) => {
      if (!val) this.storage.setItem(this.prefix(key), this.serialize(val));
    });
  }

  private forEach(callback: (key: string, val: any) => void) {
    for (let i = 0; i < this.storage.length; i++) {
      let key = this.storage.key(i);
      if (key?.startsWith(this._prefix)) {
        key = key.replace(`${this._prefix}:`, '');
        callback(key, this.get(key));
      }
    }
  }

  private serialize(val: any): string {
    const final = {
      value: val,
      startTime: new Date().getTime(),
    };
    return JSON.stringify(final);
  }

  private deserialize(val: any): any {
    if (typeof val !== 'string') {
      return undefined;
    }

    try {
      const final = JSON.parse(val);
      const currentTime = new Date().getTime();
      if (currentTime - final.startTime > this._expiredTime) return undefined;
      return final.value;
    } catch (error) {
      return val || undefined;
    }
  }

  private prefix(key: string): string {
    return `${this._prefix}:${key}`;
  }
}

const storage = new ClientStorage();

export default storage;
