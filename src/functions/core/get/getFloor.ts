import { game } from "../../../tower.js";
import floors from "../../../game/_classes/floors.js";

/** Get a floor by its number. */
export default function getFloor(floorNumber: number) {
  const floor = floors[floorNumber - 1];
  return floor;
}
