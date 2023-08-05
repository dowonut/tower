import { game } from "../../../tower.js";

/** Get the next player in a turn order. */
export default function getNextPlayer(turnOrder: TurnOrder) {
  return turnOrder.find((x) => x.isPlayer && !x.dead) as Player;
}
