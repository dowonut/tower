import _ from "lodash";
import { config, game } from "../../tower.js";

export default {
  name: "commandinfo",
  aliases: ["ci"],
  description: "Analyse all commands.",
  category: "admin",
  dev: true,
  async execute(message, args, player, server) {
    let commands = await game.getCommands();
    commands = commands.filter((x) => x.category !== "admin");
    const unlockableCommands = _.union(...commands.map((x) => x.unlockCommands));
    let content = commands
      .map((x) =>
        unlockableCommands.includes(x.name) ||
        config.defaultCommands.includes(x.name) ||
        !x.mustUnlock
          ? `**${x.name}** ✅`
          : `${x.name}`
      )
      .join("\n");
    game.send({ player, content });
  },
} satisfies Command;
