import { game } from "../../tower.js";
import fs from "fs";

/** Get unlocked player cosmetics. */
export default (async function () {
  const cosmetics = {
    hair: ["nothing", "cool", "long", "pigtails", "poofy", "short", "very_short"],
    torso: ["nothing", "bra", "crop_top", "long_shirt", "plain_shirt", "rough_shirt"],
    legs: ["nothing", "shorts", "skirt", "trousers", "underwear"],
    feet: ["nothing", "shoes"],
  };

  return cosmetics;
} satisfies PlayerFunction);
