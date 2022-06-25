import enemies from "../game/enemies.js";
import items from "../game/items.js";

import * as config from "../config.js";

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
      const item = items[itemName.toLowerCase()];
      const itemQuantity = quantity ? quantity : 1;

      const playerItem = await this.prisma.inventory.findMany({
        where: { playerId: this.id, name: itemName },
      });

      let newItem;
      if (playerItem[0]) {
        newItem = await this.prisma.inventory.updateMany({
          where: { playerId: this.id, name: itemName },
          data: {
            quantity: { increment: itemQuantity },
          },
        });

        if (playerItem[0].quantity + itemQuantity <= 0) {
          return await this.prisma.inventory.deleteMany({
            where: { playerId: this.id, name: itemName },
          });
        }
      } else {
        newItem = await this.prisma.inventory.create({
          data: {
            playerId: this.id,
            name: item.name,
            quantity: itemQuantity,
          },
        });
      }

      return newItem;
    },

    // Get item info
    getItem: async function (itemName) {
      const itemRef = await this.prisma.inventory.findMany({
        where: {
          playerId: this.id,
          name: { equals: itemName, mode: "insensitive" },
        },
      });
      if (!itemRef[0]) return undefined;

      const itemData = items[itemRef[0].name.toLowerCase()];

      return { ...itemData, ...itemRef[0] };
    },

    // Get all items
    getItems: async function () {
      const playerItems = await this.prisma.inventory.findMany({
        where: { playerId: this.id },
      });

      let itemArray = [];
      for (const playerItem of playerItems) {
        const itemData = items[playerItem.name.toLowerCase()];
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
      const enemyType = enemies[enemyInfo.name.toLowerCase()];

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
    enemyLoot: async function (enemy, game, message) {
      const loots = [];

      for (const [loot, lootInfo] of Object.entries(enemy.loot)) {
        const chance = Math.random() * 100;
        if (chance < lootInfo.dropChance) {
          const quantity = game.random(lootInfo.dropMin, lootInfo.dropMax);

          this.giveItem(lootInfo.name, quantity);
          const item = items[lootInfo.name.toLowerCase()];
          loots.push({ ...item, quantity });
        }
      }

      let lootList = ``;
      for (const item of loots) {
        lootList += `${config.emojis.plus} **${item.quantity}x** **${item.name}**`;
      }

      const embed = {
        description: lootList,
      };

      // Send death message
      game.reply(message, `you killed **${enemy.name}**.`);
      game.fastEmbed(message, this, embed, `Loot from ${enemy.name}`);
    },
  },
};
