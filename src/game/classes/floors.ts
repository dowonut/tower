import { config } from "../../tower.js";
import { createClassFromType, loadFiles } from "../../functions/core/index.js";

const FloorBaseClass = createClassFromType<FloorData>();

class FloorClass extends FloorBaseClass {
  constructor(floor: Generic<FloorData>) {
    super(floor);
  }
}

const floors = await loadFiles<FloorClass>("floors", FloorClass);
export default floors;
