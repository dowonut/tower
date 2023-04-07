import fs from "fs";
import path from "path";

import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "unlockallcommands",
  aliases: ["uac"],
  description: "Unlock all commands in the game.",
  category: "other",
  async execute(message, args, player, server) {
    const buttons: Button[] = [
      {
        id: "yes",
        label: "✔ Yes, unlock all commands.",
        style: "success",
        async function() {
          return "yes";
        },
      },
      {
        id: "no",
        label: "✖",
        style: "danger",
        async function() {
          return "no";
        },
      },
    ];

    const row = game.actionRow("buttons", buttons);

    const reply = await game.send({
      message,
      reply: true,
      content: `
Are you sure you want to unlock all commands?
This will skip all tutorials, so it's **only recommended for experienced players.**`,
      components: [row],
    });

    const result = await game.componentCollector(message, reply, buttons);

    // If yes, unlock all commands
    if (result == "yes") {
      await unlockCommands();
      return await reply.edit({
        content: "**Unlocked all commands** :white_check_mark:",
        components: [],
      });
    }
    // If no, then cancel
    else if (result == "no") {
      return await reply.edit({
        content: "**Cancelled operation**",
        components: [],
      });
    }

    async function unlockCommands() {
      const commandFiles = await game.getCommands();
      const commands = commandFiles.map((x) => x.name);

      await player.update({ user: { update: { unlockedCommands: commands } } });
    }
  },
} as Command;
