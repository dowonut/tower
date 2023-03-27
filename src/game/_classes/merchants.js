import { game, config } from "../../tower.js";

class Merchant {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }

    this.getName = () => {};
  }
}

const merchants = await game.loadFiles("merchants", Merchant);

export default merchants;
