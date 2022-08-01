import enemies from "../game/enemies.js";
import items from "../game/items.js";
import attacks from "../game/attacks.js";
import floors from "../game/floors.js";
import skills from "../game/skills.js";

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
      const item = items.find((x) => x.name == itemName.toLowerCase());

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
            name: item.getName(),
            quantity: itemQuantity,
          },
        });
      }

      return newItem;
    },

    // Unlock a command
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

    // Unlock several commands
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

    // Get current regin
    getRegion: function () {
      const regionName = this.region;
      const currentFloor = floors[this.floor - 1];

      const region = currentFloor.regions.find((x) => x.name == regionName);

      return region;
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

      const itemData = items.find(
        (x) => x.name == itemRef[0].name.toLowerCase()
      );

      return { ...itemData, ...itemRef[0] };
    },

    // Get all items
    getItems: async function () {
      const playerItems = await this.prisma.inventory.findMany({
        where: { playerId: this.id },
      });

      let itemArray = [];
      for (const playerItem of playerItems) {
        const itemData = items.find(
          (x) => x.name == playerItem.name.toLowerCase()
        );
        const item = { ...playerItem, ...itemData };

        itemArray.push(item);
      }

      return itemArray;
    },

    // Get equipped item
    getEquipped: async function (equipSlot) {
      if (!this[equipSlot]) return undefined;

      let equipName = this[equipSlot];

      const itemRef = await this.prisma.inventory.findMany({
        where: {
          playerId: this.id,
          name: { equals: equipName, mode: "insensitive" },
        },
      });

      const itemData = items.find(
        (x) => x.name == itemRef[0].name.toLowerCase()
      );

      return { ...itemData, ...itemRef[0] };
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

      const attackData = attacks.find(
        (x) => x.name == attackRef[0].name.toLowerCase()
      );

      let attack = { ...attackData, ...attackRef[0] };

      if (this.hand) {
        const item = await this.getItem(this.hand);

        if (item.weaponType == attack.type) {
          return attack;
        } else {
          return undefined;
        }
      } else {
        if (attack.type == "unarmed") {
          return attack;
        } else {
          return undefined;
        }
      }
    },

    // Get all available attacks
    getAttacks: async function () {
      const playerAttacks = await this.prisma.attack.findMany({
        orderBy: [{ remCooldown: "asc" }],
        where: { playerId: this.id },
      });

      let attackArray = [];

      for (const playerAttack of playerAttacks) {
        const attackData = attacks.find(
          (x) => x.name == playerAttack.name.toLowerCase()
        );
        const attack = { ...playerAttack, ...attackData };

        attackArray.push(attack);
      }

      let finalArray;

      if (this.hand) {
        const item = await this.getItem(this.hand);
        finalArray = attackArray.filter((x) => x.type === item.weaponType);
      } else {
        finalArray = attackArray.filter((x) => x.type === "unarmed");
      }

      return finalArray;
    },

    // Get specific skill
    getSkill: async function (skillName) {
      const skillRef = await this.prisma.skill.findMany({
        where: {
          playerId: this.id,
          name: { equals: skillName, mode: "insensitive" },
        },
      });
      if (!skillRef[0]) return undefined;

      const skillData = skills.find((x) => x.name == skillRef[0].name);

      let skill = { ...skillData, ...skillRef[0] };

      return skill;
    },

    // Get all player skills
    getSkills: async function () {
      const playerSkills = await this.prisma.skill.findMany({
        where: { playerId: this.id },
      });

      let skillArray = [];

      for (const playerSkill of playerSkills) {
        const skillData = skills.find((x) => x.name == playerSkill.name);
        const skill = { ...playerSkill, ...skillData };

        skillArray.push(skill);
      }

      return skillArray;
    },

    // Deal damage to player
    getDamageTaken: async function (damageInput) {
      // Calculate defence
      const defenceMultiplier = 1 - this.defence / 100;

      // Calculate final damage
      const damage = Math.floor(damageInput * defenceMultiplier);

      // Log damage
      console.log(
        `${this.username} takes damage: ${damageInput} x ${defenceMultiplier} = ${damage}`
      );

      return damage;
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
      const enemyType = enemies.find(
        (x) => x.name == enemyInfo.name.toLowerCase()
      );

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

    // Remove current enemy from the database
    killEnemy: async function () {
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
          const item = items.find((x) => x.name == lootInfo.name.toLowerCase());
          loots.push({ ...item, quantity });
        }
      }

      // Get xp from enemy kill
      let xp = game.random(enemy.xp.min, enemy.xp.max);

      let lootList = ``;
      for (const item of loots) {
        //lootList += `${config.emojis.plus} **${item.quantity}x** **${item.name}**`;
        if (item.quantity > 1) {
          lootList += `\\> **${item.getName()}** | \`x${item.quantity}\`\n`;
        } else {
          lootList += `\\> **${item.getName()}**\n`;
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

      // Give xp to player
      await this.giveXp(xp, message, server, game);
    },

    // Give the player some random loot from their current region
    giveRandomLoot: async function (message, game) {
      // Fetch region and format region name
      const region = this.getRegion();
      const regionName = game.titleCase(region.name);

      // Fetch item from weights
      const item = game.getWeightedArray(region.loot);
      const itemName = game.titleCase(item.name);

      // Determine item quantity
      const itemQuantity = item.min ? game.random(item.min, item.max) : 1;

      // Give item to player
      await this.giveItem(item.name, itemQuantity);

      // Format quantity text
      let quantityText = itemQuantity > 1 ? `\`${itemQuantity}x\` ` : ``;

      // Send message to player
      return game.reply(
        message,
        `you explore the **${regionName}** and find ${quantityText}**${itemName}**`
      );
    },

    // Give xp to player
    giveXp: async function (xp, message, server, game) {
      // Add xp to player
      let player = await this.update({ xp: { increment: xp } });

      // Calculate xp required for next level
      let nextLevelXp = config.nextLevelXp(player.level);
      let levelUp = 0;

      // Once level up reached
      for (let i = 0; player.xp >= nextLevelXp; i++) {
        // Calculate remaining xp
        let newXp = player.xp - nextLevelXp;

        // Update player data
        player = await this.update({
          xp: newXp,
          level: { increment: 1 },
          statpoints: { increment: 1 },
        });

        // Get required xp for next level
        nextLevelXp = config.nextLevelXp(player.level);
        levelUp++;

        // Unlock new commands
        this.unlockCommands(message, server, [
          "stats",
          "statup",
          "floor",
          "region",
        ]);
      }

      if (levelUp > 0) {
        game.reply(
          message,
          `you leveled up! New level: \`${player.level}\` :tada:\n:low_brightness: You have \`${levelUp}\` new stat points. Check your stats with \`${server.prefix}stats\``
        );
      }
    },
  },
};
