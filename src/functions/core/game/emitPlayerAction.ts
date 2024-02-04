import { game } from "../../../tower.js";

/** Notify the encounter that the player just performed an action. */
export default function emitPlayerAction(args: { player: Player }) {
  const { player } = args;
  game.emitter.emit("playerAction", {
    encounterId: player.encounterId,
    player,
  } satisfies PlayerActionEmitter);
  return;
}
