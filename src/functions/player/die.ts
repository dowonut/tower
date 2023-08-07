import { marksLostOnDeath } from "../../config.js";
import floors from "../../game/_classes/floors.js";
import { game } from "../../tower.js";

/** Kill the player */
export default (async function () {
  const currentMarks = this.marks;
  const newMarks = Math.floor(currentMarks * marksLostOnDeath);
  const newRegion = game.getFloor(this.floor).regions[0].name;

  const player = await this.update({
    marks: newMarks,
    region: newRegion,
  });

  return {
    marks: newMarks,
    region: newRegion,
    newPlayer: player,
  };
} satisfies PlayerFunction);
