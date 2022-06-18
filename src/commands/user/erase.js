import { MessageActionRow, MessageButton } from "discord.js";

export default {
  name: "erase",
  description: "Completely reset your character. **CANNOT BE UNDONE.**",
  cooldown: "30",
  category: "Character",
  async execute(message, args, prisma, config, player) {
    const button1 = new MessageButton()
      .setCustomId("yes")
      .setLabel("✔")
      .setStyle("SUCCESS");
    const button2 = new MessageButton()
      .setCustomId("no")
      .setLabel("✖")
      .setStyle("DANGER");

    const row = new MessageActionRow().addComponents([button1, button2]);

    const botMsg = await message.channel.send({
      content:
        "**Dowonut**, Are you sure you want to __**permanently**__ erase your character?",
      components: [row],
    });

    const filter = (i) => i.user.id === message.author.id;

    const collector = botMsg.createMessageComponentCollector({
      filter,
      componentType: "BUTTON",
      time: 15000,
    });

    collector.on("collect", async (i) => {
      if (i.customId == "yes") {
        player.erase();
        botMsg.edit({
          content: "Reset complete.",
          components: [],
        });
      } else if (i.customId == "no") {
        botMsg.edit({
          content: "Cancelled operation.",
          components: [],
        });
      }
    });
  },
};
