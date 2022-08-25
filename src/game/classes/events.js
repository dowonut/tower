import { loadFiles } from "./_loadFiles.js";

class Event {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
  }
}

const events = await loadFiles("events", Event);

export default events;
