export default {
  name: "eat",
  aliases: ["ea"],
  arguments: "<item name>",
  description: "Eat food you have in your inventory.",
  category: "Items",
  async execute(message, args, prisma, config, player, game, server) {
    if (!args[0])
      return game.error(message, "provide the name of a food item.");

    const item = await player.getItem(args.join(" "));

    if (!item)
      return game.error(
        message,
        `not a valid item.\nCheck your items with \`${server.prefix}inventory\``
      );

    if (item.category !== "food")
      return game.error(message, `this isn't food idiot.`);

    let heal = item.health;

    if (player.health == player.maxHealth)
      return game.error(message, `you are already at max health!`);

    if (player.health + heal > player.maxHealth)
      heal = player.maxHealth - player.health;

    const playerData = await player.update({ health: { increment: heal } });

    await player.giveItem(item.name, -1);

    game.reply(
      message,
      `you ate an **${item.getName()}** and healed \`${heal}\` points! | ${
        config.emojis.health
      }\`${playerData.health}/${player.maxHealth}\``
    );

    return;
  },
};
