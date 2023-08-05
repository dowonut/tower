import fs from "fs";
import path from "path";

import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "unlockallcommands",
  aliases: ["uac"],
  description: "Unlock all commands in the game.",
  category: "other",
  mustUnlock: false,
  async execute(message, args, player, server) {
    const buttons: Button[] = [
      {
        id: "yes",
        label: "✔ Yes, unlock all commands.",
        style: "success",
        stop: true,
        async function() {
          await unlockCommands();
          return await reply.edit({
            content: "**Unlocked all commands** :white_check_mark:",
            components: [],
          });
        },
      },
      {
        id: "no",
        label: "✖",
        style: "danger",
        stop: true,
        async function() {
          return await reply.edit({
            content: "**Cancelled operation**",
            components: [],
          });
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

    game.componentCollector({ message, reply, components: buttons });

    async function unlockCommands() {
      const commandFiles = await game.getCommands();
      const commands = commandFiles.map((x) => x.name);

      await player.update({ user: { update: { unlockedCommands: commands } } });
    }
  },
} as Command;
