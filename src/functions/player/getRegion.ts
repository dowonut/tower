import floors from "../../game/_classes/floors.js";

/**
 * Get current region.
 */
export default (function () {
  const regionName = this.region;
  const currentFloor = floors[this.floor - 1];

  const region = currentFloor.regions.find((x) => x.name == regionName);

  return region;
} satisfies PlayerFunction);
