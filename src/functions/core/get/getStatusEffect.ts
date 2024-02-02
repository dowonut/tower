import _ from "lodash";
import statusEffects from "../../../game/_classes/statusEffects.js";
import { game } from "../../../tower.js";

/** Get a status effect. */
export default function getStatusEffect(name: string) {
  const statusEffect = statusEffects.find((x) => x.name == name.toLowerCase());

  if (!statusEffect) return;

  return _.cloneDeep(statusEffect);
}
