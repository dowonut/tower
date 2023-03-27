import { game, config } from "../../tower.js";
class Event {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
  }
}

const events = await game.loadFiles("events", Event);

export default events;
