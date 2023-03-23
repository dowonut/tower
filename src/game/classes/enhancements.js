import { game, config } from "../../tower.js";
const { emojis } = config;

class Enhancement {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
  }
}

const enhancements = await game.loadFiles("enhancements", Enhancement);

export default enhancements;

// export default [
//   new Enhancement({
//     name: "cutting",
//     type: ["sword", "axe"],
//     levels: [{ info: "Increases slashing damage by 2." }],
//   }),
// ];
