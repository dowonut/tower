import usersettings from "../../game/classes/usersettings.js";

export default {
  name: "settings",
  aliases: ["se"],
  arguments: "",
  description: "See your user settings and change.",
  category: "Other",
  useInCombat: true,
  async execute(message, args, config, player, server) {
    let description = ``;
    for (const [key, value] of Object.entries(player.user)) {
      if (["id", "discordId"].includes(key)) continue;
      const setting = usersettings.find((x) => x.name == key);

      description += `\n**${key}:** \`${value}\` (*default: \`${setting.default}\`*)`;
    }
    const title = "User Settings";
    const embed = {
      description: description,
    };

    const reply = await game.fastEmbed(message, player, embed, title);
  },
};
