export default {
  name: "eat",
  aliases: ["ea"],
  arguments: "<item name>",
  description: "Eat food you have in your inventory.",
  category: "Items",
  async execute(message, args, prisma, config, player, game, server) {
    if (!args[0])
      return game.reply(message, "provide the name of a food item.");

    const item = await player.getItem(args.join(" "));

    if (!item)
      return game.reply(
        message,
        `not a valid item. Check your items with \`${server.prefix}inventory\``
      );

    if (item.category !== "Food")
      return game.reply(message, `this isn't food idiot.`);

    let heal = item.health;

    if (player.health == player.maxHealth)
      return game.reply(message, `you are already at max health!`);

    if (player.health + heal > player.maxHealth)
      heal = player.maxHealth - player.health;

    const playerData = await player.update({ health: { increment: heal } });

    player.giveItem(item.name, -1);

    game.reply(
      message,
      `you ate an **${item.name}** and healed **\`${heal}\`** points! | :drop_of_blood:\`${playerData.health}/${player.maxHealth}\``
    );
  },
};
