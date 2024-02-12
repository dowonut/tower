import { game } from "../../tower.js";

export default {
  name: "enterchamber",
  aliases: ["ech", "enterch", "entercha", "echamber"],
  description: "Enter the currently selected dungeon chamber.",
  category: "dungeon",
  cooldownGroup: "dungeon_action",
  environment: ["dungeon"],
  async execute(message, args, player, server) {
    // Check if player is party leader
    if (player.party && !player.isPartyLeader) {
      return game.error({ player, content: `only the party leader can enter a chamber.` });
    }

    // Get dungeon
    const dungeon = await player.getDungeon();

    // Send emitter
    game.emitter.emit("playerDungeonAction", {
      action: "enter_chamber",
      dungeon,
    } satisfies DungeonActionEmitter);
  },
} satisfies Command;
