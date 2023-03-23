import { game, config } from "../../tower.js";

class Floor {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
  }
}

const floors = await game.loadFiles("floors", Floor);
export default floors;
