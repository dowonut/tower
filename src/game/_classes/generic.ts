import { game } from "../../tower.js";

const generic = {
  /** Get the name of the object. */
  getName() {
    return game.titleCase(this?.name);
  },
};

export default generic;
