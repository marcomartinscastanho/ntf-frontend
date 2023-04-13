export const LocalStorage = {
  get(key, def = null) {
    try {
      return JSON.parse(localStorage.getItem(key) || def);
    } catch (err) {
      return localStorage.getItem(key) || def;
    }
  },
  set(key, val) {
    if (typeof val === "object") {
      localStorage.setItem(key, JSON.stringify(val));
    } else {
      localStorage.setItem(key, val);
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  init() {
    [].forEach(this.remove);
  },
};

export default LocalStorage;

// reference: it works...
