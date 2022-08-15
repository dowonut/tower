import { loadFiles } from "./_loadFiles.js";

class Merchant {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }

    this.getName = () => {};
  }
}

const merchants = await loadFiles("merchants", Merchant);

export default merchants;
