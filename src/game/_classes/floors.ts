import { config } from "../../tower.js";
import { createClassFromType } from "../../functions/core/index.js";
import { loadFiles } from "../../functions/core/game/loadFiles.js";

const FloorBaseClass = createClassFromType<FloorData>();

class FloorClass extends FloorBaseClass {
  constructor(floor: Generic<FloorData>) {
    super(floor);
  }
}

const floors = await loadFiles<FloorClass>("floors", FloorClass);
export default floors;
