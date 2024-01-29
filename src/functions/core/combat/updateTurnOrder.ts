import { EnemyClass } from "../../../game/_classes/enemies.js";
import PlayerClass from "../../../game/_classes/players.js";
import { game } from "../../../tower.js";

/** Update the current encounter turn order. */
export default async function updateTurnOrder(turnOrder: TurnOrder) {
  // Update turn order
  if (turnOrder[0].SV <= 0) {
    turnOrder[0] = await (turnOrder[0] as Player).update({ SV: turnOrder[0].baseSV });
    turnOrder = game.getTurnOrder({ entities: turnOrder });
  }

  const decreaseSV = turnOrder[0].SV;
  console.log(decreaseSV);
  // Update Speed Value
  if (decreaseSV > 0) {
    for (const [i, entity] of turnOrder.entries()) {
      turnOrder[i] = await (entity as Player).update({ SV: { increment: -decreaseSV } });
    }
  }
  return turnOrder;
}
