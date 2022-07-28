import enemies from "../game/enemies.js";
import items from "../game/items.js";
import attacks from "../game/attacks.js";

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
        where: {
          playerId: this.id,
          name: { equals: itemName, mode: "insensitive" },
        },
      });

      let newItem;
      if (playerItem[0]) {
        newItem = await this.prisma.inventory.updateMany({
          where: {
            playerId: this.id,
            name: { equals: itemName, mode: "insensitive" },
          },
          data: {
            quantity: { increment: itemQuantity },
          },
        });

        if (playerItem[0].quantity + itemQuantity <= 0) {
          return await this.prisma.inventory.deleteMany({
            where: {
              playerId: this.id,
              name: { equals: itemName, mode: "insensitive" },
            },
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

    unlockCommand: async function (message, server, commandName) {
      if (this.unlockedCommands.includes(commandName)) return;

      await this.prisma.player.update({
        where: { id: this.id },
        data: {
          unlockedCommands: { push: commandName },
        },
      });

      return message.author.send(
        `New command unlocked: **\`${commandName}\`**\nRead about it with \`${server.prefix}help\``
      );
    },

    unlockCommands: async function (message, server, commandNames) {
      let commands = [];
      for (const commandName of commandNames) {
        if (!this.unlockedCommands.includes(commandName)) {
          await this.prisma.player.update({
            where: { id: this.id },
            data: {
              unlockedCommands: { push: commandName },
            },
          });
          commands.push(commandName);
        }
      }

      if (!commands[0]) return;

      let commandList = commands.join(", ");

      return message.author.send(
        `New commands unlocked: **\`${commandList}\`**\nRead about them with \`${server.prefix}help\``
      );
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

    // Get specific attack
    getAttack: async function (attackName) {
      const attackRef = await this.prisma.attack.findMany({
        where: {
          playerId: this.id,
          name: { equals: attackName, mode: "insensitive" },
        },
      });
      if (!attackRef[0]) return undefined;

      const attackData = attacks[attackRef[0].name.toLowerCase()];

      return { ...attackData, ...attackRef[0] };
    },

    // Get all available attacks
    getAttacks: async function () {
      const playerAttacks = await this.prisma.attack.findMany({
        orderBy: [{ remCooldown: "asc" }],
        where: { playerId: this.id },
      });

      let attackArray = [];

      for (const playerAttack of playerAttacks) {
        const attackData = attacks[playerAttack.name.toLowerCase()];
        const attack = { ...playerAttack, ...attackData };

        attackArray.push(attack);
      }

      return attackArray;
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
    enemyLoot: async function (enemy, game, server, message) {
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

      // Get xp from enemy kill
      let xp = game.random(enemy.xpMin, enemy.xpMax);

      // Add xp to player
      let player = await this.update({ xp: { increment: xp } });

      // Calculate xp required for next level
      let nextLevelXp = config.nextLevelXp(player.level);
      let levelUp = 0;

      // Once level up reached
      while (player.xp >= nextLevelXp) {
        // Calculate remaining xp
        let newXp = player.xp % nextLevelXp;

        // Update player data
        player = await this.update({
          xp: newXp,
          level: { increment: 1 },
          skillpoints: { increment: 1 },
        });

        // Get required xp for next level
        nextLevelXp = config.nextLevelXp(player.level);
        levelUp++;

        // Unlock new command
        this.unlockCommand(message, server, "skillpoints");
      }

      let lootList = ``;
      for (const item of loots) {
        //lootList += `${config.emojis.plus} **${item.quantity}x** **${item.name}**`;
        if (item.quantity > 1) {
          lootList += `\\> **${item.name}** | \`x${item.quantity}\`\n`;
        } else {
          lootList += `\\> **${item.name}**\n`;
        }
      }
      lootList += `\nXP: \`+${xp}\``;

      const embed = {
        description: lootList,
      };

      // Send death message
      //game.reply(message, `you killed **${enemy.name}**.`);
      message.channel.send(
        `**${message.author.username}** killed **${enemy.name}** :skull:`
      );
      game.fastEmbed(message, this, embed, `Loot from ${enemy.name}`);

      if (levelUp > 0) {
        game.reply(
          message,
          `you leveled up! New level: \`${player.level}\` :tada:`
        );
      }
    },
  },
};
