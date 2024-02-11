import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "flee",
  aliases: ["fl"],
  description: "Attempt to flee from the enemy you're fighting.",
  category: "combat",
  useInCombatOnly: true,
  useInTurnOnly: true,
  cooldownGroup: "combat_action",
  useInDungeon: true,
  async execute(message, args, player, server) {
    if (player.party && !player.isPartyLeader)
      return game.error({
        player,
        content: `only the party leader can decide to flee from an encounter.`,
      });

    // Notify encounter of player action
    game.emitPlayerAction({ player });

    // Flee from encounter
    game.emitter.emit("flee", {
      encounterId: player.encounterId,
      player,
    } satisfies PlayerFleeEmitter);
  },
} as Command;
