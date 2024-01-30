import _ from "lodash";
import { game } from "../../../tower.js";

/** Get turn order based on current Speed Values */
export default function getTurnOrder(args?: {
  players?: Player[];
  enemies?: Enemy[];
  entities?: (Player | Enemy)[];
}) {
  const { players, enemies, entities } = args;

  let array = entities ? entities : [...players, ...enemies];

  const turnOrder = _.orderBy(
    array,
    ["SV", "SPD", "isPlayer", "displayName"],
    ["asc", "desc", "desc", "desc"]
  );
  return turnOrder;
}
