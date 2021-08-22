export class Storage {
  static set(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
    Storage.onChange();
  }

  static get(key: string) {
    const value = localStorage.getItem(key);
    if (!value) return value;
    return JSON.parse(value);
  }

  static remove(key: string) {
    localStorage.removeItem(key);
    Storage.onChange();
  }

  static clear() {
    localStorage.clear();
    Storage.onChange();
  }

  static onChange() {
    window.location.reload();
  }
}
