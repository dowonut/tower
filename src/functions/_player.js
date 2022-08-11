import enemies from "../game/classes/enemies.js";
import items from "../game/classes/items.js";
import attacks from "../game/classes/attacks.js";
import floors from "../game/classes/floors.js";
import skills from "../game/classes/skills.js";
import tutorials from "../game/classes/tutorials.js";
import recipes from "../game/classes/recipes.js";
import merchants from "../game/classes/merchants.js";

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
        // Update existing item
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
        // Create new item

        // Check if item is recipe
        if (item.category == "recipe") {
          await this.addRecipe(item.item);
          newItem = item;
        } else {
          newItem = await this.prisma.inventory.create({
            data: {
              playerId: this.id,
              name: item.name,
              quantity: itemQuantity,
            },
          });
        }
      }

      return newItem;
    },

    // Unlock several commands
    unlockCommands: async function (message, server, commandNames) {
      for (const commandName of commandNames) {
        if (!this.unlockedCommands.includes(commandName)) {
          await this.prisma.player.update({
            where: { id: this.id },
            data: {
              unlockedCommands: { push: commandName },
            },
          });
        } else {
          continue;
        }

        let embed;

        const tutorial = tutorials.find(
          (x) => x.name == commandName.toLowerCase()
        );

        if (tutorial) {
          const tutorialName = tutorial.name;

          embed = {
            title: `New Command Unlocked: \`${server.prefix}${tutorialName}\``,
            description: tutorial.info,
          };

          if (tutorial.image) embed.image = { url: tutorial.image };
        } else {
          embed = {
            title: `New Command Unlocked: \`${server.prefix}${commandName}\``,
          };
        }

        embed.color = config.botColor;
        embed.footer = {
          text: `See all your unlocked commands with ${server.prefix}help`,
        };

        message.author.send({ embeds: [embed] });
      }
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

      return { ...itemRef[0], ...itemData };
    },

    // Get all items
    getItems: async function () {
      const playerItems = await this.prisma.inventory.findMany({
        orderBy: [{ quantity: "asc" }],
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

      const item = await this.getItem(equipName);

      return item;
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

        if (!attackData) continue;

        const attack = { ...playerAttack, ...attackData };

        attackArray.push(attack);
      }

      let finalArray;

      if (this.hand) {
        const item = await this.getItem(this.hand);
        finalArray = attackArray.filter((x) =>
          x.type.includes(item.weaponType)
        );
      } else {
        finalArray = attackArray.filter((x) => x.type.includes("unarmed"));
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
        orderBy: [{ level: "desc" }, { xp: "desc" }],
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

    // Get all recipes or a specific recipe
    getRecipes: async function (input) {
      let recipeArr = [];
      let playerRecipes;
      if (input) {
        playerRecipes = await this.prisma.recipe.findMany({
          //orderBy: [{ level: "desc" }, { xp: "desc" }],
          where: {
            playerId: this.id,
            name: { equals: input, mode: "insensitive" },
          },
        });

        if (!playerRecipes[0]) return undefined;
      } else {
        playerRecipes = await this.prisma.recipe.findMany({
          //orderBy: [{ level: "desc" }, { xp: "desc" }],
          where: { playerId: this.id },
        });
      }
      for (const playerRecipe of playerRecipes) {
        const recipeData = recipes.find((x) => x.name == playerRecipe.name);
        const recipe = { ...playerRecipe, ...recipeData };

        recipeArr.push(recipe);
      }

      return recipeArr;
    },

    addRecipe: async function (recipeName) {
      const recipe = recipes.find((x) => x.name == recipeName.toLowerCase());

      if (!recipe) return undefined;

      const playerRecipe = await this.fetch("recipe", recipeName);

      if (playerRecipe) return;

      await this.prisma.recipe.create({
        data: { playerId: this.id, name: recipe.name },
      });

      player.unlockCommands(message, server, ["recipes"]);
    },

    // Get thing from player
    fetch: async function (key, input) {
      let array = [];
      let items;
      if (input) {
        items = await this.prisma[key].findMany({
          //orderBy: [{ level: "desc" }, { xp: "desc" }],
          where: {
            playerId: this.id,
            name: { equals: input, mode: "insensitive" },
          },
        });

        if (!items[0]) return undefined;
      } else {
        items = await this.prisma[key].findMany({
          //orderBy: [{ level: "desc" }, { xp: "desc" }],
          where: { playerId: this.id },
        });
      }
      for (const item of items) {
        const itemData = eval(key + "s").find((x) => x.name == item.name);
        const finalItem = { ...item, ...itemData };

        array.push(finalItem);
      }

      if (array.length > 1) return array;
      else return array[0];
    },

    // Deal damage to player
    getDamageTaken: async function (attack, game) {
      // Calculate defence
      const defenceMultiplier = 1 - this.defence / 100;

      let total = 0;
      for (let attackDamage of attack.damages) {
        // Choose base damage randomly
        const baseDamage = game.random(attackDamage.min, attackDamage.max);

        // Calculate final damage
        const damage = Math.ceil(baseDamage * defenceMultiplier);

        attackDamage.final = damage;
        total += damage;
      }
      attack.total = total;

      return attack;
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
      if (!this.fighting) return undefined;

      const enemyInfo = await this.prisma.enemy.findUnique({
        where: { id: this.fighting },
      });

      if (!enemyInfo) return undefined;

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

      for (const loot of enemy.loot) {
        const chance = Math.random() * 100;
        if (chance <= loot.dropChance) {
          const quantity = game.random(loot.min, loot.max);

          this.giveItem(loot.name, quantity);
          const item = items.find((x) => x.name == loot.name);
          loots.push({ ...item, quantity });
        }
      }

      // Get xp from enemy kill
      let xp = game.random(enemy.xp.min, enemy.xp.max);

      let lootList = ``;
      for (const item of loots) {
        console.log(item.quantity);
        //lootList += `${config.emojis.plus} **${item.quantity}x** **${item.name}**`;
        if (item.quantity > 1) {
          lootList += `\n+ **${item.getName()}** \`x${item.quantity}\``;
        } else {
          lootList += `\n+ **${item.getName()}**`;
        }
      }

      // Check if enemy dropped shard
      if (enemy.shard) {
        const chance = Math.random() * 100;
        if (chance <= enemy.shard.dropChance) {
          const shardName = `${enemy.shard.type} shard`;

          this.giveItem(shardName);
          lootList += `\n+ **${game.titleCase(shardName)}**${
            config.emojis.items[shardName]
          }`;
        }
      }

      lootList += `\n\n\`+${xp} XP\``;

      const embed = {
        description: lootList,
      };

      // Send death message
      //game.reply(message, `you killed **${enemy.name}**.`);
      game.reply(message, `you killed **${enemy.getName()}** :skull:`);
      game.fastEmbed(message, this, embed, `Loot from ${enemy.getName()}`);

      // Give xp to player
      await this.giveXp(xp, message, server, game);
    },

    // Give the player some random loot from their current region
    giveRandomLoot: async function (message, server, game) {
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
      await game.reply(
        message,
        `you explore the **${regionName}** and find ${quantityText}**${itemName}**`
      );

      // Unlock region loot
      await this.addExplore(message, server, "loot", undefined, item.name);
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

    // Give xp to player skill
    giveSkillXp: async function (xp, skillName, message, game) {
      // Add xp to player skill
      await this.prisma.skill.updateMany({
        where: { playerId: this.id, name: skillName },
        data: { xp: { increment: xp } },
      });

      let skillRef = await this.prisma.skill.findMany({
        where: { playerId: this.id, name: skillName },
      });

      // Check if skill exists
      if (!skillRef[0]) return undefined;

      // Grab skill
      let skill = skillRef[0];

      // Calculate xp required for next level
      let nextLevelXp = config.nextLevelXpSkill(skill.level);
      let levelUp = 0;

      // Once level up reached
      for (let i = 0; skill.xp >= nextLevelXp; i++) {
        // Calculate remaining xp
        let newXp = skill.xp - nextLevelXp;

        // Update player data
        await this.prisma.skill.updateMany({
          where: { playerId: this.id, name: skillName },
          data: { xp: newXp, level: { increment: 1 } },
        });

        skillRef = await this.prisma.skill.findMany({
          where: { playerId: this.id, name: skillName },
        });
        skill = skillRef[0];

        // Get required xp for next level
        nextLevelXp = config.nextLevelXpSkill(skill.level);
        levelUp++;
      }

      if (levelUp > 0) {
        game.reply(
          message,
          `your skill **${game.titleCase(skill.name)}** has reached level \`${
            skill.level + levelUp
          }\` :tada:`
        );
      }
    },

    // Get a player's unlocked merchants
    getUnlockedMerchants: async function () {
      const merchantsRef = await this.prisma.exploration.findMany({
        where: { playerId: this.id, floor: this.floor, type: "merchant" },
      });

      if (!merchantsRef[0]) return undefined;

      let merchantArr = [];
      for (const merchantRef of merchantsRef) {
        const merchant = merchants[this.floor - 1].find(
          (x) => x.category == merchantRef.category
        );
        if (!merchant) continue;
        merchantArr.push(merchant);
      }
      return merchantArr;
    },

    // Get explored by type
    getExplored: async function (type) {
      let explored;
      if (type) {
        explored = await this.prisma.exploration.findMany({
          where: {
            playerId: this.id,
            floor: this.floor,
            type: type.toLowerCase(),
          },
        });
      } else {
        explored = await this.prisma.exploration.findMany({
          where: { playerId: this.id, floor: this.floor },
        });
      }
      return explored;
    },

    // Unlock new exploration
    addExplore: async function (message, server, type, category, name) {
      const floor = this.floor;

      const existing = await this.prisma.exploration.findMany({
        where: {
          playerId: this.id,
          floor: floor,
          type: type.toLowerCase(),
          name: name ? name : undefined,
          category: category ? category : undefined,
        },
      });
      if (existing[0]) return;

      await this.prisma.exploration.create({
        data: {
          playerId: this.id,
          floor: floor,
          type: type.toLowerCase(),
          name: name ? name : undefined,
          category: category ? category : undefined,
        },
      });

      message.channel.send(
        `*New ${type} discovered! See your discoveries with \`${server.prefix}region\`*`
      );
    },

    // Unlock a random merchant on the current floor
    unlockRandomMerchant: async function (message, server, game) {
      const region = this.getRegion();
      const regionName = game.titleCase(region.name);

      const foundMerchant = await this.getExplored("merchant");

      const foundMerchants = foundMerchant.map((x) => x.category);

      const merchantCategories = region.merchants.map((x) => x.category);

      let merchantC;
      while (!merchantC || foundMerchants.includes(merchantC)) {
        merchantC = game.getRandom(merchantCategories);
      }

      const merchant = merchants[this.floor - 1].find(
        (x) => x.category == merchantC
      );

      const mName = game.titleCase(merchant.name);
      const mCategory = game.titleCase(merchant.category + " merchant");

      await game.reply(
        message,
        `you explore the **${regionName}** and come across **${mName}**, the local \`${mCategory}\``
      );
      await this.addExplore(message, server, "merchant", merchantC);
    },
  },
};
