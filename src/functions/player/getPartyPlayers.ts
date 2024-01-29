import { game } from "../../tower.js";

/** Get all players in current party. */
export default (async function () {
  if (!this.inCombat) return; //throw new Error("Player must be in combat to get enemy.");

  const encounter = this.encounter;
  const playersData = encounter.players;

  let finalPlayers: Player[] = [];
  for (const playerData of playersData) {
    finalPlayers.push(
      await game.getPlayer({
        server: this.server,
        channel: this.channel,
        discordId: playerData.user.discordId,
      })
    );
  }

  return finalPlayers;
} satisfies PlayerFunction);
