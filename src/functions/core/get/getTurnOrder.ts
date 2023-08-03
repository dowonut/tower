import { game } from "../../../tower.js";

/** Get turn order based on current Speed Values */
export default function getTurnOrder(players: Player[], enemies: Enemy[]) {
  const turnOrder: (Player | Enemy)[] = [...players, ...enemies].sort(
    (a, b) => {
      if (a.SV > b.SV) return 1;
      if (a.SV < b.SV) return -1;
      if (a.SPD < b.SPD) return 1;
      if (a.SPD > b.SPD) return -1;
      if (!("user" in a)) return 1;
      if ("user" in a) return -1;
    }
  );
  return turnOrder;
}
