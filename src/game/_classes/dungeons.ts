import { config } from "../../tower.js";
import { createClassFromType } from "../../functions/core/index.js";
import { loadFiles } from "../../functions/core/game/loadFiles.js";
import _ from "lodash";

const DungeonBaseClass = createClassFromType<DungeonData>();

class DungeonClass extends DungeonBaseClass {
  constructor(dungeon: Generic<DungeonData>) {
    super(dungeon);
  }

  /** Generate a specific dungeon instance. */
  generateInstance() {
    let instance: DungeonInstance;
    for (let w = 0; w < 8; w++) {
      for (let h = 0; h < 5; h++) {
        instance[w][h] = 0;
      }
    }
    console.log(instance);
  }
}

const dungeons = await loadFiles<DungeonClass>("dungeons", DungeonClass);
export default dungeons;
