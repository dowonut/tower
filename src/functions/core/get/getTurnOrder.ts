import { game } from "../../../tower.js";

/** Get turn order based on current Speed Values */
export default function getTurnOrder(args?: { players?: Player[]; enemies?: Enemy[]; entities?: (Player | Enemy)[] }) {
  const { players, enemies, entities } = args;

  let array = entities ? entities : [...players, ...enemies];

  const turnOrder = array.sort((a, b) => {
    if (a.SV > b.SV) return 1;
    if (a.SV < b.SV) return -1;
    if (a.SPD < b.SPD) return 1;
    if (a.SPD > b.SPD) return -1;
    if (!a.isPlayer) return 1;
    if (a.isPlayer) return -1;
  });
  return turnOrder;
}
