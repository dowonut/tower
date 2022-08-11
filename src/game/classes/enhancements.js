import game from "../../functions/titleCase.js";
import fs from "fs";
import { emojis } from "../../config.js";

class Enhancement {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
  }
}

export default [
  new Enhancement({
    name: "cutting",
    type: ["sword", "axe"],
    levels: [{ info: "Increases slashing damage by 2." }],
  }),
];
