import { game } from "../../../tower.js";
import * as classes from "../../../game/_classes/index.js";
import _ from "lodash";
import { FloorClass } from "../../../game/_classes/floors.js";

/** Get a game object class instance without reference. */
export default function get<T extends keyof typeof classes>(
  type: T,
  name: string
): (typeof classes)[T][0] {
  const list = classes[type];
  if (!_.isArray(list)) return;
  const item = list.find((x) => {
    if (x instanceof FloorClass) return;
    return x.name == name.toLowerCase();
  });
  return _.cloneDeep(item) as any;
}
