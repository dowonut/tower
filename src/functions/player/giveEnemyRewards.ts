import { game } from "../../tower.js";

/** Give rewards from killing enemies. */
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

  return { xp: totalXP, loot: loots };
} satisfies PlayerFunction);
