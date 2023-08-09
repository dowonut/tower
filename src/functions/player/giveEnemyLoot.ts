import { game } from "../../tower.js";

/** Get loot from an enemy. */
export default (async function (args: { enemies: Enemy[] }) {
  const { enemies } = args;
  let loots: Item[] = [];
  let totalXP = 0;

  for (const enemy of enemies) {
    if (!enemy.dead) continue;
    let enemyLoot = [];
    if (enemy.loot) enemyLoot.push(...enemy.loot);
    if (enemy.type.loot) enemyLoot.push(...enemy.type.loot);
    // Get loot
    for (const loot of enemyLoot) {
      const chance = Math.random() * 100;
      if (chance <= loot.dropChance) {
        const quantity = game.random(loot.min, loot.max);

        await this.giveItem(loot.name, quantity);
        let item = game.getItem(loot.name);
        item.quantity = quantity;
        loots.push(item);
      }
    }
    // Get XP
    const xp = enemy.XP;
    totalXP += xp;
    console.log(xp, totalXP);
  }

  return { xp: totalXP, loot: loots };
} satisfies PlayerFunction);
