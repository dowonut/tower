import { loadFiles } from "./_loadFiles.js";
import fs from "fs";

class Passive {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
  }
}

export default [
  new Passive({
    name: "all",
    type: "DAMAGE",
  }),
  new Passive({
    name: "all",
    type: "CRIT_DAMAGE",
  }),
  new Passive({
    name: "all",
    type: "CRIT_DAMAGE",
  }),
];
