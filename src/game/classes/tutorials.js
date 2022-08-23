import game from "../../functions/format/titleCase.js";

class Tutorial {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }

    this.getName = () => {
      return game.titleCase(this.name);
    };
  }
}

export default [
  new Tutorial({
    name: "attack",
    info: `
This is the main command you use to attack during combat. 

\`attack\`
List all your available attacks and how much damage they do.
The symbol next to the damage indicates the "damage type". 

\`attack <attack name>\`
Use a specific attack during combat.`,
  }),
  new Tutorial({
    name: "enemyinfo",
    info: `
Get important information about the enemy you're currently fighting.
Shows description, health, stats, and current status effects.`,
  }),
  new Tutorial({
    name: "flee",
    info: `
Run away from a combat encounter.
An enemy can attack with reduced damage while you're running away.`,
  }),
  new Tutorial({
    name: "status",
    info: `
Get important information about yourself during combat.
Shows health, stats, and current status effects.`,
  }),
  new Tutorial({
    name: "inventory",
    info: `
List all items in your inventory.
Also shows whether item is equipped.`,
  }),
  new Tutorial({
    name: "iteminfo",
    info: `
Get information about a specific item.
Shows image, description, category, and more.
Useful for seeing resell value and food effects.

\`iteminfo <item name>\``,
  }),
  new Tutorial({
    name: "sell",
    info: `
Sell an item in your inventory.

\`sell <item name> $ [quantity]\``,
  }),
  new Tutorial({
    name: "buy",
    info: `
Buy an item from a merchant.

\`buy <item name> $ [quantity]\``,
  }),
  new Tutorial({
    name: "eat",
    info: `
Eat a piece of food from your inventory.

\`eat <food name>\``,
  }),
  new Tutorial({
    name: "merchants",
    info: `
Merchants are unique characters on each floor who sell things.
You can usually encounter them by exploring in towns and villages.

\`merchants\`
Get a list of all merchants you've found on your current floor.`,
  }),
  new Tutorial({
    name: "floor",
    info: `
Your mission is to climb the tower, and that starts here on Floor 1.
Each floor has several regions you can travel between for different enemies, loot, and more.

\`floor\`
Shows all regions on your current floor.
Symbols next to regions indicate available activities.`,
  }),
  new Tutorial({
    name: "region",
    info: `
Get information about your current region.
Shows all discovered enemies, items, merchants, etc.`,
  }),
  new Tutorial({
    name: "travel",
    info: `
Travel to a region on your current floor.

\`travel <region name>\``,
  }),
  new Tutorial({
    name: "equipment",
    info: `
You can also equip weapons and armor to become more powerful.

\`equipment\`
List all your current equipment and its bonuses.

\`equip <item name>\`
Equip an item from your inventory. Use command again to unequip.`,
  }),
  new Tutorial({
    name: "stats",
    info: `
Show your core stats. 
These are essential for unlocking new abilities and growing stronger.`,
  }),
  new Tutorial({
    name: "statup",
    info: `
Put stat points into one of your core stats. 
Can't be undone, so choose wisely.

\`statup <stat name> $ [quantity]\`
Assign points to a stat.`,
  }),
  new Tutorial({
    name: "skills",
    info: `
Almost everything in Tower has an associated skill.
You level up your skills by doing the associated things.
Leveling up skills will unlock new abilities and make you stronger.

\`skills\`
See all your skills and their levels.

\`skill <skill name>\`
Get detailed information about one of your skills.
Shows next level rewards and more.`,
  }),
  new Tutorial({
    name: "breakdown",
    info: `
Get a detailed breakdown of your player statistics.
Shows passive/active modifiers, equipment bonuses, stat bonuses, and more.`,
  }),
  new Tutorial({
    name: "leaderboard",
    info: `
Show the global leaderboard for player levels.

\`leaderboard <marks/health/strength/...>\`
Shows the global leaderboard for a specific category.`,
  }),
  new Tutorial({
    name: "drink",
    info: `
Drink a potion from your inventory.

\`drink <potion name>\``,
  }),
];
