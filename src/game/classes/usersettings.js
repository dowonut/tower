import game from "../../functions/format/titleCase.js";

class Setting {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
  }
}

export default [
  new Setting({
    name: "embed_color",
    default: "2f3136",
    options: [{ name: "2f3136" }, { name: "191919" }],
  }),
];
