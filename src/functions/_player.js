import enemies from "../game/classes/enemies.js";
import items from "../game/classes/items.js";
import attacks from "../game/classes/attacks.js";
import floors from "../game/classes/floors.js";
import skills from "../game/classes/skills.js";
import tutorials from "../game/classes/tutorials.js";
import recipes from "../game/classes/recipes.js";
import merchants from "../game/classes/merchants.js";

import { game, config } from "../tower.js";

export default {
  // Test
  test: function () {
    console.log("test");
  },
  // Delete player
  erase: async function () {
    await prisma.inventory.deleteMany({
      where: { playerId: this.id },
    });

    await prisma.player.delete({
      where: { id: this.id },
    });
  },

  // Update player
  update: async function (update) {
    return await prisma.player.update({
      where: { id: this.id },
      data: update,
    });
  },

  // Refesh player object
  refresh: async function () {
    return await game.getPlayer({ id: this.discordId, server: this.server });
  },

  // Give item
  giveItem: async function (itemName, quantity) {
    const item = items.find((x) => x.name == itemName.toLowerCase());

    const itemQuantity = quantity ? quantity : 1;

    const playerItem = await prisma.inventory.findMany({
      where: {
        playerId: this.id,
        name: { equals: itemName, mode: "insensitive" },
      },
    });

    // Emit event for item received
    game.events.emit("itemReceive", { item: item, player: this });

    let newItem;
    if (playerItem[0]) {
      // Update existing item
      newItem = await prisma.inventory.updateMany({
        where: {
          playerId: this.id,
          name: { equals: itemName, mode: "insensitive" },
        },
        data: {
          quantity: { increment: itemQuantity },
        },
      });
      // Delete item from database if quantity is 0
      if (playerItem[0].quantity + itemQuantity <= 0) {
        return await prisma.inventory.deleteMany({
          where: {
            playerId: this.id,
            name: { equals: itemName, mode: "insensitive" },
          },
        });
      }
    } else {
      // Check if item is recipe
      if (item.category == "recipe") {
        await this.addRecipe(item.item);
        newItem = item;
      } else {
        // Create new item
        newItem = await prisma.inventory.create({
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
    let tutorialRefs = [];
    for (const commandName of commandNames) {
      if (!this.unlockedCommands.includes(commandName)) {
        await prisma.player.update({
          where: { id: this.id },
          data: {
            unlockedCommands: { push: commandName },
          },
        });
      } else {
        continue;
      }

      const tutorial = tutorials.find(
        (x) => x.name == commandName.toLowerCase()
      );

      if (tutorial) {
        tutorialRefs.push(tutorial);
      } else {
        tutorialRefs.push({ name: commandName });
      }
    }

    if (tutorialRefs.length < 1) return;

    const infos = tutorialRefs.map((x) => {
      let info = ``;
      info += `\n\n${config.emojis.bullet} **${x.name.toUpperCase()}**`;
      if (x.info) {
        info += `${x.info}`;
      } else {
        info += ``;
      }
      return info;
    });

    const nameText = `New Commands Unlocked!`;
    const description = infos.join("");

    const embed = {
      title: nameText,
      color: config.towerColor,
      description: description,
    };

    return message.author.send({ embeds: [embed] });
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
    const itemRef = await prisma.inventory.findMany({
      where: {
        playerId: this.id,
        name: { equals: itemName, mode: "insensitive" },
      },
    });
    if (!itemRef[0]) return undefined;

    const itemData = items.find((x) => x.name == itemRef[0].name.toLowerCase());

    return { ...itemRef[0], ...itemData };
  },

  // Get all items
  getItems: async function () {
    const playerItems = await prisma.inventory.findMany({
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

  // Get the type of weapon player is currently doing
  getWeaponType: async function () {
    const eqItem = await this.getEquipped("hand");

    if (!eqItem) return "unarmed";

    let weaponType = eqItem.weaponType;

    return weaponType;
  },

  // Get all passive effects that currently apply
  getPassives: async function (target) {
    target = target ? target.toLowerCase() : undefined;
    // Get all player passives
    const passives = await prisma.passive.findMany({
      where: { playerId: this.id, target: target },
    });

    // Get player weapon type
    const weaponType = await this.getWeaponType();

    // Iterate through all passives
    let passiveArray = [];
    for (const passive of passives) {
      // Check if passive applies to equipped weapon or all
      if (passive.name !== "all" && passive.name !== weaponType) continue;

      passiveArray.push(passive);
    }

    return passiveArray;
  },

  // Get all passives
  getAllPassives: async function (type) {
    // Get all player passives
    const passives = await prisma.passive.findMany({
      where: {
        playerId: this.id,
        type: type ? type.toLowerCase() : undefined,
      },
    });

    return passives;
  },

  // Add a passive stat to a player
  addPassive: async function (object) {
    let { source, name, target, value, modifier, duration } = object;
    duration = duration ? duration : undefined;
    source = source ? source : "skill";
    name = name ? name : "all";
    target = target ? target : "damage";

    const dataObject = {
      playerId: this.id,
      source: source,
      name: name,
      target: target,
      modifier: modifier,
      duration: duration,
    };

    const filteredPassive = await prisma.passive.findMany({
      where: dataObject,
    });

    // If passive doesn't exist, create a new entry
    if (!filteredPassive[0]) {
      // Create new passive
      await prisma.passive.create({
        data: { ...dataObject, value: value },
      });
    }
    // If passive already exists, then update
    else {
      // Update the passive value
      await prisma.passive.updateMany({
        where: {
          id: filteredPassive[0].id,
        },
        data: {
          value: { increment: value },
        },
      });
    }
  },

  // Update all passive effects
  updatePassives: async function () {
    const passives = await this.getAllPassives();

    for (let passive of passives) {
      const { duration } = passive;
      if (duration !== null) {
        passive = await prisma.passive.update({
          where: {
            id: passive.id,
          },
          data: {
            duration: {
              increment: -1,
            },
          },
        });

        if (passive.duration < 1) {
          passive = await prisma.passive.delete({
            where: { id: passive.id },
          });
        }
      }
    }

    return passives;
  },

  // Get specific attack
  getAttack: async function (attackName) {
    const attackRef = await prisma.attack.findMany({
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
    const playerAttacks = await prisma.attack.findMany({
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
      finalArray = attackArray.filter((x) => x.type.includes(item.weaponType));
    } else {
      finalArray = attackArray.filter((x) => x.type.includes("unarmed"));
    }

    return finalArray;
  },

  // Add new attack
  addAttack: async function (attackName) {
    await prisma.attack.create({
      data: { playerId: this.id, name: attackName.toLowerCase() },
    });
  },

  // Get specific skill
  getSkill: async function (skillName) {
    const skillRef = await prisma.skill.findMany({
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
    const playerSkills = await prisma.skill.findMany({
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

  // Add new skill
  addSkill: async function (skillName) {
    // Check if player has skill
    const skillRef = prisma.skill.findMany({
      where: {
        playerId: this.id,
        name: skillName.toLowerCase(),
      },
    });

    // Return if player already has skill
    if (skillRef[0]) return;

    // Create new skill
    await prisma.skill.create({
      data: {
        playerId: this.id,
        name: skillName.toLowerCase(),
      },
    });

    return await game.reply(
      this.message,
      `New skill unlocked: **${game.titleCase(skillName)}**`
    );
  },

  // Get all recipes or a specific recipe
  getRecipes: async function (input) {
    let recipeArr = [];
    let playerRecipes;
    if (input) {
      playerRecipes = await prisma.recipe.findMany({
        //orderBy: [{ level: "desc" }, { xp: "desc" }],
        where: {
          playerId: this.id,
          name: { equals: input, mode: "insensitive" },
        },
      });

      if (!playerRecipes[0]) return undefined;
    } else {
      playerRecipes = await prisma.recipe.findMany({
        where: { playerId: this.id },
      });
    }
    for (const playerRecipe of playerRecipes) {
      const recipeData = recipes.find((x) => x.name == playerRecipe.name);
      let recipe = { ...playerRecipe, ...recipeData };

      recipe.available = await recipe.canCraft(this);

      recipeArr.push(recipe);
    }

    // Sort by whether the player can craft the recipe
    recipeArr = recipeArr.sort((a, b) => (a.canCraft < b.canCraft ? 1 : -1));

    return recipeArr;
  },

  // Add new recipe
  addRecipe: async function (recipeName) {
    const recipe = recipes.find((x) => x.name == recipeName.toLowerCase());

    if (!recipe) return undefined;

    const playerRecipe = await this.fetch("recipe", recipeName);

    if (playerRecipe) return;

    await prisma.recipe.create({
      data: { playerId: this.id, name: recipe.name },
    });
  },

  // Get thing from player
  fetch: async function (key, input) {
    let array = [];
    let items;
    if (input) {
      items = await prisma[key].findMany({
        //orderBy: [{ level: "desc" }, { xp: "desc" }],
        where: {
          playerId: this.id,
          name: { equals: input, mode: "insensitive" },
        },
      });

      if (!items[0]) return undefined;
    } else {
      items = await prisma[key].findMany({
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
  getDamageTaken: async function (attack) {
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
    return await this.update({ inCombat: true, fighting: enemy.id });
  },

  // Exit combat
  exitCombat: async function () {
    // Update player to be in combat
    this.update({ fighting: null, inCombat: false, canAttack: true });
  },

  // Get the current enemy
  getCurrentEnemy: async function () {
    if (!this.fighting) return undefined;

    const enemyInfo = await prisma.enemy.findUnique({
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
    return await prisma.enemy.update({
      where: { id: this.fighting },
      data: update,
    });
  },

  // Remove current enemy from the database
  killEnemy: async function () {
    await prisma.enemy.delete({
      where: { id: this.fighting },
    });
  },

  // Give loot from enemy
  enemyLoot: async function (enemy, server, message) {
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
      lootList += `\n+ ${item.getEmoji()} **${item.getName()}**`;
      if (item.quantity > 1) lootList += ` | \`x${item.quantity}\``;
    }

    // Check if enemy dropped shard
    if (enemy.shard) {
      const chance = Math.random() * 100;
      if (chance <= enemy.shard.dropChance) {
        const shardName = `${enemy.shard.type} shard`;
        const shard = game.getItem(shardName);

        this.giveItem(shardName);
        lootList += `\n+ ${shard.getEmoji()} **${shard.getName()}**`;
      }
    }

    lootList += `\n\n\`+${xp} XP\``;
    lootList += `\n${game.levelProgress(this, game, xp)}`;

    const embed = {
      description: lootList,
    };

    // Send death message
    await game.reply(message, `you killed **${enemy.getName()}** :skull:`);
    const reply = await game.fastEmbed(
      message,
      this,
      embed,
      `Loot from ${enemy.getName()}`
    );

    // Give xp to player
    const levelReply = await this.giveXp(xp, message, server, game);

    return { reply, levelReply };
  },

  // Give the player some random loot from their current region
  giveRandomLoot: async function (message, server) {
    // Fetch region and format region name
    const region = this.getRegion();
    const regionName = game.titleCase(region.name);

    // Fetch item from weights
    let item = game.getWeightedArray(region.loot);
    const itemName = game.titleCase(item.name);
    item = { ...item, ...game.getItem(item.name) };
    const itemEmoji = item.getEmoji();

    // Determine item quantity
    const itemQuantity = item.min ? game.random(item.min, item.max) : 1;

    // Give item to player
    await this.giveItem(item.name, itemQuantity);

    // Format quantity text
    let quantityText = itemQuantity > 1 ? `\`${itemQuantity}x\` ` : ``;

    // Unlock region loot
    this.addExplore(message, server, "loot", undefined, item.name);

    // Send message to player
    return await game.reply(
      message,
      `you explore the **${regionName}** and find ${quantityText}**${itemName}** ${itemEmoji}`
    );
  },

  // Give xp to player
  giveXp: async function (xp, message, server) {
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
    }

    // Unlock new commands
    this.unlockCommands(message, server, [
      "stats",
      "statup",
      "floor",
      "region",
      "breakdown",
      "leaderboard",
    ]);

    if (levelUp > 0) {
      return await game.reply(
        message,
        `**Level Up!**

:tada: You are now level \`${player.level}\`
:low_brightness: You have \`${levelUp}\` new stat points`,
        true,
        config.green,
        config.emojis.level_up
      );
    } else return undefined;
  },

  // Give xp to player skill
  giveSkillXp: async function (xp, skillName) {
    const message = this.message;
    // Add xp to player skill
    await prisma.skill.updateMany({
      where: { playerId: this.id, name: skillName },
      data: { xp: { increment: xp } },
    });

    let skillRef = await prisma.skill.findMany({
      where: { playerId: this.id, name: skillName },
    });

    // Check if skill exists
    if (!skillRef[0]) return undefined;

    // Grab skill
    let skill = skillRef[0];

    // Calculate xp required for next level
    let nextLevelXp = config.nextLevelXpSkill(skill.level);

    // Once level up reached
    let reply;
    for (let i = 0; skill.xp >= nextLevelXp; i++) {
      // Calculate remaining xp
      let newXp = skill.xp - nextLevelXp;

      // Update player data
      await prisma.skill.updateMany({
        where: { playerId: this.id, name: skillName },
        data: { xp: newXp, level: { increment: 1 } },
      });

      skillRef = await prisma.skill.findMany({
        where: { playerId: this.id, name: skillName },
      });
      skill = skillRef[0];

      // Send level up message
      const skillNameCase = game.titleCase(skill.name);
      let levelMsg = `your skill **${skillNameCase}** has reached level \`${skill.level}\` :tada:`;
      let skillLevelMsg = ``;

      // Fetch data about skill and check if next level exists
      const skillData = await this.getSkill(skill.name);
      const skillLevel = skillData.levels[skill.level - 1];

      // Level up skill
      if (skillLevel) {
        skillLevelMsg = await skillData.levelUp(this, skillLevel);
      }

      // Send message to player
      reply = await game.success(message, `${levelMsg}\n\n${skillLevelMsg}`);

      // Get required xp for next level
      nextLevelXp = config.nextLevelXpSkill(skill.level);
    }
    return reply;
  },

  // Get a player's unlocked merchants
  getUnlockedMerchants: async function () {
    const merchantsRef = await prisma.exploration.findMany({
      where: { playerId: this.id, floor: this.floor, type: "merchant" },
    });

    if (!merchantsRef[0]) return undefined;

    let merchantArr = [];
    for (const merchantRef of merchantsRef) {
      const merchant = merchants.find(
        (x) => x.category == merchantRef.category && x.floor == this.floor
      );
      if (!merchant) continue;
      merchantArr.push(merchant);
    }
    return merchantArr;
  },

  // Get a players merchant stock for a specific item
  getMerchantStock: async function (itemName) {
    const items = await prisma.merchantStock.findMany({
      where: {
        playerId: this.id,
        floor: this.floor,
        itemName: itemName.toLowerCase(),
      },
    });

    if (items.length < 1) return undefined;

    return items[0];
  },

  // Get explored by type
  getExplored: async function (type) {
    let explored;
    if (type) {
      explored = await prisma.exploration.findMany({
        where: {
          playerId: this.id,
          floor: this.floor,
          type: type.toLowerCase(),
        },
      });
    } else {
      explored = await prisma.exploration.findMany({
        where: { playerId: this.id, floor: this.floor },
      });
    }
    return explored;
  },

  // Unlock new exploration
  addExplore: async function (message, server, type, category, name) {
    const floor = this.floor;

    const existing = await prisma.exploration.findMany({
      where: {
        playerId: this.id,
        floor: floor,
        type: type.toLowerCase(),
        name: name ? name : undefined,
        category: category ? category : undefined,
      },
    });
    if (existing[0]) return;

    await prisma.exploration.create({
      data: {
        playerId: this.id,
        floor: floor,
        type: type.toLowerCase(),
        name: name ? name : undefined,
        category: category ? category : undefined,
      },
    });

    message.channel.send(
      `*New ${type} discovered!\nSee your discoveries with \`${server.prefix}region\`*`
    );
  },

  // Unlock a random merchant on the current floor
  unlockRandomMerchant: async function (message, server) {
    const region = this.getRegion();
    const regionName = game.titleCase(region.name);

    const foundMerchant = await this.getExplored("merchant");

    const foundMerchants = foundMerchant.map((x) => x.category);

    const merchantCategories = region.merchants.map((x) => x.category);

    let merchantC;
    while (!merchantC || foundMerchants.includes(merchantC)) {
      merchantC = game.getRandom(merchantCategories);
    }

    const merchant = merchants.find(
      (x) => x.category == merchantC && x.floor == this.floor
    );

    const mName = game.titleCase(merchant.name);
    const mCategory = game.titleCase(merchant.category + " merchant");

    const reply = await game.reply(
      message,
      `you explore the **${regionName}** and come across **${mName}**, the local \`${mCategory}\``
    );
    game.cmdButton(message, reply, ["explore", message, [], server]);
    await this.addExplore(message, server, "merchant", merchantC);
  },
};
