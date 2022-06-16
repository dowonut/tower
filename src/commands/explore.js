import lootTable from "loot-table";

export default {
  name: "explore",
  aliases: ["e"],
  async execute(message, args, prisma, config, player) {
    //message.reply("You find nothing + ratio");

    const loot = new lootTable();

    const items = ["stick", "stone", "pile of dirt", "pebble"];

    const { area } = await player.location();

    if (area.danger) loot.add("enemy", 5);
    if (area.exploration[0]) loot.add("location", 1);
    loot.add("item", 10);

    const find = loot.choose();

    if (find == "location") {
      const location = config.getRandom(area.exploration);

      message.reply(`You come across a \`${location}\``);
    } else if (find == "item") {
      const item = config.getRandom(items);

      message.reply(`You find a \`${item}\``);
    } else if (find == "enemy") {
      const enemyName = config.getRandom(area.enemies);

      const enemy = await config.getEnemy(enemyName, prisma);
      console.log(enemy);

      message.reply(`You encounter a wild \`${enemy.name}\``);
    }
  },
};
