import { loadFiles } from "./_loadFiles.js";
import { emojis } from "../../config.js";

class Enhancement {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
  }
}

const enhancements = await loadFiles("enhancements", Enhancement);

export default enhancements;

// export default [
//   new Enhancement({
//     name: "cutting",
//     type: ["sword", "axe"],
//     levels: [{ info: "Increases slashing damage by 2." }],
//   }),
// ];
