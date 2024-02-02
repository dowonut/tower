import { game } from "../../tower.js";

export default {
  name: "entercombat",
  aliases: ["ec"],
  description: "Enter a combat encounter after discovering it.",
  category: "combat",
  async execute(message, args, player, server) {
    if (!player.preEncounter)
      return game.error({ player, content: `you have no available combat encounters.` });

    game.emitter.emit("enterCombat", {
      playerId: player.id,
      messageId: player.preEncounter.messageId,
    });
  },
} satisfies Command;
