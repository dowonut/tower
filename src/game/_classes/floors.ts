import { config } from "../../tower.js";
import { createClassFromType, getEnemy } from "../../functions/core/index.js";
import { loadFiles } from "../../functions/core/game/loadFiles.js";
import _ from "lodash";

const FloorBaseClass = createClassFromType<FloorData>();

export class FloorClass extends FloorBaseClass {
  constructor(floor: Generic<FloorData>) {
    super(floor);
  }

  /** Get the minimum recommended level for a region. */
  getRecommendedLevelForRegion(name: string) {
    const region = this.regions.find((x) => x.name == name);
    let enemyLevels: number[] = [];
    for (const enemyData of region.enemies || []) {
      const enemy = getEnemy(enemyData.name);
      enemyLevels.push(enemy.level);
    }
    if (!_.isEmpty(enemyLevels)) {
      return Math.min(...enemyLevels);
    } else return undefined;
  }
}

const floors = await loadFiles<FloorClass>("floors", FloorClass);
export default floors;
