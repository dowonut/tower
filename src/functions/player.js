import enemies from "../game/enemies.js";
import items from "../game/items.js";

export default {
  player: {
    // Delete player
    erase: async function () {
      await this.prisma.inventory.deleteMany({
        where: { playerId: this.id },
      });

      await this.prisma.player.delete({
        where: { id: this.id },
      });
    },

    // Update player
    update: async function (update) {
      return await this.prisma.player.update({
        where: { id: this.id },
        data: update,
      });
    },

    // Give item
    giveItem: async function (itemName, quantity) {
      const item = items[itemName];
      const itemQuantity = quantity ? quantity : 1;

      return await this.prisma.inventory.create({
        data: {
          playerId: this.id,
          name: item.name,
          quantity: itemQuantity,
        },
      });
    },

    // Get item info
    getItem: async function (itemName) {
      const itemRef = await this.prisma.inventory.findUnique({
        where: { playerId: this.id, name: itemName },
      });

      const itemData = items[itemName];

      return { ...itemData, ...itemRef };
    },

    // Get all items
    getItems: async function () {
      const playerItems = await this.prisma.inventory.findMany({
        where: { playerId: this.id },
      });

      let itemArray = [];
      for (const playerItem of playerItems) {
        const itemData = items[playerItem.name];
        const item = { ...playerItem, ...itemData };

        itemArray.push(item);
      }

      return itemArray;
    },

    // Enter combat
    enterCombat: async function (enemy) {
      // Update player to be in combat
      this.update({ inCombat: true, fighting: enemy.id });
    },

    // Exit combat
    exitCombat: async function () {
      // Update player to be in combat
      this.update({ fighting: null, inCombat: false });
    },

    // Get the current enemy
    getCurrentEnemy: async function () {
      const enemyInfo = await this.prisma.enemy.findUnique({
        where: { id: this.fighting },
      });
      const enemyType = enemies[enemyInfo.enemyType];

      const enemy = { ...enemyInfo, ...enemyType };

      return enemy;
    },

    // Update enemy data
    updateEnemy: async function (update) {
      return await this.prisma.enemy.update({
        where: { id: this.fighting },
        data: update,
      });
    },

    // Remove an enemy from the database
    killEnemy: async function (enemy) {
      await this.prisma.enemy.delete({
        where: { id: this.fighting },
      });
    },

    // Give loot from enemy
    enemyLoot: async function (enemy, game) {
      for (const [loot, lootInfo] of Object.entries(enemy.loot)) {
        console.log(lootInfo);

        const chance = Math.random() * 100;
        if (chance < lootInfo.dropChance) {
          const quantity = game.random(lootInfo.dropMin, lootInfo.dropMax);

          this.giveItem(lootInfo.name, quantity);
          console.log(`gave ${quantity} ${lootInfo.name} to ${this.username}`);
        }
      }
    },
  },
};
