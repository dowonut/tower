import { game } from "../../tower.js";

/** Give loot from enemy to player. */
export default (async function (args: { enemy: Enemy; server: Server; message: Message }) {
  const { enemy, server, message } = args;
  let loots: Item[] = [];

  for (const loot of enemy.loot) {
    const chance = Math.random() * 100;
    if (chance <= loot.dropChance) {
      const quantity = game.random(loot.min, loot.max);

      this.giveItem(loot.name, quantity);
      let item = game.getItem(loot.name);
      item.quantity = quantity;
      loots.push(item);
    }
  }

  // Get xp from enemy kill
  let xp = enemy.XP;

  let lootList = ``;
  for (const item of loots) {
    lootList += `\n${item.getEmoji()} **${item.getName()}**`;
    if (item.quantity > 1) lootList += ` \`x${item.quantity}\``;
  }

  // Check if enemy dropped shard
  if (enemy.shard) {
    const chance = Math.random() * 100;
    if (chance <= enemy.shard.dropChance) {
      const shardName = `${enemy.shard.type} shard`;
      const shard = game.getItem(shardName);

      this.giveItem(shardName);
      lootList += `\n+ ${shard.getEmoji()} **${shard.getName()}**`;
    }
  }

  lootList += `\n\n\`+${xp} XP\``;
  lootList += `\n${game.levelProgress(this, xp)}`;

  const embed = {
    description: lootList,
  };

  // Send death message
  await game.send({
    message,
    reply: true,
    content: `you killed **${enemy.getName()}** :skull:`,
  });
  const reply = await game.fastEmbed({
    message,
    player: this,
    embed,
    title: `Loot from ${enemy.getName()}`,
    send: true,
  });

  // Give xp to player
  const levelReply = await this.giveXp({ amount: xp, message });

  return { reply, levelReply };
} satisfies PlayerFunction);
