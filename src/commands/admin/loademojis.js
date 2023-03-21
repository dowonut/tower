import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "loademojis",
  aliases: ["le"],
  arguments: "",
  description: "Load all emojis.",
  category: "admin",
  async execute(message, args, player, server) {
    const guilds = client.guilds.cache.map((x) => {
      return { id: x.id, name: x.name, emojis: x.emojis };
    });

    for (let guild of guilds) {
      guild.emojis = (await guild.emojis.fetch()).map((x) => {
        return { id: x.id, name: x.name, animated: x.animated };
      });
    }

    // const rejoice_testing = guilds.find((x) => x.name == "rejoice testing");
    const guild = guilds.find((x) => x.id == message.guild.id);
    if (!guild) return;

    let emojiList = "";
    for (const emoji of guild.emojis) {
      let animated = emoji.animated ? "a" : "";
      let emojiFormat = `<${animated}:${emoji.name}:${emoji.id}>`;
      emojiList += `\n${emojiFormat} \`${emojiFormat}\``;
      //   emojiList += emojiFormat;
    }

    if (emojiList.length > 4000)
      emojiList =
        emojiList.slice(0, 4000) + "...\nToo many emojis for one embed :(";

    const embed = {
      color: config.botColor,
      description: emojiList,
    };

    game.send({ message, embeds: [embed] });
  },
};
