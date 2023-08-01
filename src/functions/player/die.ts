import { marksLostOnDeath } from "../../config.js";
import floors from "../../game/_classes/floors.js";
import { game } from "../../tower.js";

/** Kill the player */
export default (async function () {
  const currentMarks = this.marks;
  const newMarks = Math.floor(currentMarks * marksLostOnDeath);
  const newRegion = game.getFloor(this.floor).regions[0].name;

  await this.update({
    marks: newMarks,
    region: newRegion,
    health: this.maxHP,
  });

  return {
    marks: newMarks,
    region: newRegion,
  };
} satisfies PlayerFunction);
