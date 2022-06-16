export default {
  name: "travel",
  aliases: ["t"],
  async execute(message, args, prisma, config, player) {
    if (!args[0]) return message.reply("Specify an area to travel to");

    const input = args.join("_");

    const newArea = await prisma.area.findMany({
      where: { name: { equals: input, mode: "insensitive" } },
    });

    if (!newArea[0]) return message.reply("Not a valid area");

    if (player.areaId == newArea[0].id)
      return message.reply("You are already here!");

    const exploration = await player.exploration(newArea[0]);

    if (!exploration) {
      // Travel to new area
      message.reply(
        `:racehorse: Travelled to \`${newArea[0].name}\`\n\n**New area discovered! \`+100 XP\`**`
      );

      await player.update({
        areaId: newArea[0].id,
        exploration: { create: { areaId: newArea[0].id } },
      });
    } else {
      // Travel to area already found
      message.reply(`:racehorse: Travelled to \`${newArea[0].name}\``);

      await prisma.player.update({
        where: { id: player.id },
        data: {
          areaId: newArea[0].id,
        },
      });
    }
  },
};
