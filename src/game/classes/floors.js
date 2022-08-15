import { loadFiles } from "./_loadFiles.js";

class Floor {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
  }
}

const floors = await loadFiles("floors", Floor);

export default floors;
