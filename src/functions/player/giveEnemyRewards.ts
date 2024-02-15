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
    const levelScale = Math.floor(enemy.level / 2);
    if (enemy.level <= 40) {
      essences["frail essence"] += Math.max(game.random(levelScale - 1, levelScale + 3), 1);
    }
    // Ordinary essence
    if (enemy.level >= 30 && enemy.level <= 70) {
      essences["ordinary essence"] += Math.max(
        game.random(levelScale - 14 - 1, levelScale - 14 + 3),
        0
      );
    }
    // Potent essence
    if (enemy.level >= 60) {
      essences["potent essence"] += Math.max(
        game.random(levelScale - 29 - 1, levelScale - 29 + 3),
        0
      );
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
