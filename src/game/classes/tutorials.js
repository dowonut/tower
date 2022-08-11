import game from "../../functions/titleCase.js";

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
Use a specific attack during combat.

New attacks are unlocked through skill progression or weapons.`,
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
\`iteminfo <item name>\`
Get information about a specific item.
Shows image, description, category, and more.
Useful for seeing resell value and food effects.`,
  }),
  new Tutorial({
    name: "sell",
    info: `
\`sell <item name>\`
Sell an item you have in your inventory.

\`sell <item name> $ <quantity>\`
Sell several of an item.

\`sell <item name> $ all\`
Sell all of an item.`,
  }),
  new Tutorial({
    name: "buy",
    info: `
\`buy <item name>\`
Buy an item from a merchant.

\`buy <item name> $ <quantity>\`
Buy several of an item from a merchant.

\`buy <item name> $ all\`
Buy all of an item from a merchant.`,
  }),
  new Tutorial({
    name: "eat",
    info: `
\`eat <food name>\`
Eat a piece of food in your inventory.`,
  }),
  new Tutorial({
    name: "merchants",
    info: `
Merchants are unique characters on each floor who sell things.
You can usually encounter them by exploring in towns and villages.

\`merchants\`
Get a list of all merchants you've found on your current floor.

\`merchant <merchant type>\`
Get a list of items sold by a specific merchant.`,
  }),
  new Tutorial({
    name: "floor",
    info: `
Your mission is to climb the tower, and that starts here on Floor 1.
Each floor has several regions you can travel between for different enemies, loot, and more.

\`floor\`
Shows all regions on your current floor.
Symbols next to regions indicate activities.
:fish: = fishing
:evergreen_tree: = woodcutting
:pick: = mining`,
  }),
  new Tutorial({
    name: "region",
    info: `
Get information about your current region.
Shows all enemies and activities.`,
  }),
  new Tutorial({
    name: "travel",
    info: `
\`travel <region name>\`
Travel to a specific region on your current floor.`,
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

\`statup <stat name>\`
Put 1 point into a stat.

\`statup <stat name> $ <quantity>\`
Put several points into a stat.

\`statup <stat name> $ all\`
Put all available points into a stat.`,
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
];
