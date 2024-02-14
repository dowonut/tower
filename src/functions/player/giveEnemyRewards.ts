import { game } from "../../tower.js";

/** Give rewards from killing enemies. */
export default (async function (args: { enemies: Enemy[] }) {
  const { enemies } = args;
  let loots: Item[] = [];
  let totalXP = 0;

  let essences = {
    "frail essence": 0,
    "ordinary essence": 0,
    "potent essence": 0,
  };

  for (const enemy of enemies) {
    if (!enemy.dead) continue;
    let enemyLoot = [];
    if (enemy.loot) enemyLoot.push(...enemy.loot);
    if (enemy.type.loot) enemyLoot.push(...enemy.type.loot);
    // Frail essence
    if (enemy.level <= 40) {
      essences["frail essence"] += game.random(enemy.level, enemy.level + 5);
    }
    // Ordinary essence
    if (enemy.level >= 30 && enemy.level <= 70) {
      essences["ordinary essence"] += game.random(enemy.level - 29, enemy.level - 29 + 5);
    }
    // Potent essence
    if (enemy.level >= 60) {
      essences["potent essence"] += game.random(enemy.level - 59, enemy.level - 59 + 5);
    }
    // Get loot
    for (const loot of enemyLoot) {
      const chance = Math.random() * 100;
      if (chance <= loot.dropChance) {
        const quantity = game.random(loot.min, loot.max);

        // Give item to player
        await this.giveItem(loot.name, quantity);
        let item = game.getItem(loot.name);
        item.quantity = quantity;
        if (loots.find((x) => x.name == item.name)) {
          loots.find((x) => x.name == item.name).quantity += quantity;
        } else {
          loots.push(item);
        }
      }
    }
    // Get XP
    const xp = enemy.XP;
    totalXP += xp;
  }

  // Add essences to loot list
  for (const [key, value] of Object.entries(essences)) {
    if (value <= 0) continue;
    const item = game.getItem(key);
    item.quantity = value;
    await this.giveItem(key, value);
    loots.push(item);
  }

  return { xp: totalXP, loot: loots };
} satisfies PlayerFunction);
