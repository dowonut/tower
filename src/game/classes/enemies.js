import randomFunction from "../../functions/getRandom.js";
import randomFunction2 from "../../functions/random.js";
import game from "../../functions/titleCase.js";
import { loadFiles } from "./_loadFiles.js";
import fs from "fs";
import util from "util";
import * as config from "../../config.js";
const getRandom = randomFunction.getRandom;
const random = randomFunction2.random;

class Enemy {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }

    // Check if enemy is part of a class
    if (object.class) {
      // Set enemy xp based on class xp
      this.xp = {
        min: object.class.xp.min + this.xp,
        max: object.class.xp.max + this.xp,
      };

      // Combine strengths and weaknesses
      this.strong = object.class.strong;
      this.weak = object.class.weak;

      if (object.strong) this.strong = this.strong.concat(object.strong);
      if (object.weak) this.weak = this.weak.concat(object.weak);
    }

    // GET ENEMY IMAGE
    this.getImage = () => {
      // Format item name
      const enemyName = this.name.split(" ").join("_").toLowerCase();

      // Create path and check if item image exists
      const path = `./assets/enemies/${enemyName}.png`;
      let file = undefined;

      // Attach image
      if (fs.existsSync(path)) {
        // Get image file
        file = {
          attachment: path,
          name: `${enemyName}.png`,
        };
      }

      return file;
    };

    // GET ENEMY NAME
    this.getName = () => {
      return game.titleCase(this.name);
    };

    // GET ALL AVAILABLE ENEMY ATTACKS
    this.getAttacks = () => {
      if (!object.class) return;
      // Fetch all class attacks available to the enemy
      let attacks = object.class.attacks.filter((x) =>
        object.attacks.includes(x.name)
      );

      // Calculate and map damage of attacks
      attacks = attacks.map((x) => ({
        ...x,
        damage: this.getDamage(x),
      }));

      return attacks;
    };

    // CHOOSE BEST ATTACK AND RETURN ATTACK DATA
    this.chooseAttack = (player) => {
      const attacks = this.getAttacks();

      // Sort by damage descending
      attacks.sort((a, b) => (a.totalMax > b.totalMax ? 1 : -1));

      // Define chosen attack
      let chosenAttack = attacks[0];

      return chosenAttack;
    };

    // GET DAMAGE OF ATTACK
    this.getDamage = (input) => {
      let attack = { damages: [], totalMin: 0, totalMax: 0 };
      for (const value of input.damage) {
        // Sex values
        let damageMin = value.min;
        let damageMax = value.max;

        // Apply modifiers if present
        let modifier = ``;
        if (value.modifier) {
          modifier = value.modifier.replace("LEVEL", object.level);
        }

        // Evaluate modifiers
        damageMin = eval(damageMin + modifier);
        damageMax = eval(damageMax + modifier);

        // Push damages
        attack.damages.push({
          type: value.type,
          min: damageMin,
          max: damageMax,
        });
        attack.totalMin += damageMin;
        attack.totalMax += damageMax;
      }
      return attack;
    };

    // FORMAT ATTACK MESSAGE
    this.attackMessage = (attack, player) => {
      if (!attack.messages) return undefined;

      let message = getRandom(attack.messages);

      const damages = attack.damage.damages.map(
        (x) => `\`${x.final}\`${config.emojis.damage[x.type]}`
      );
      const damageText = damages.join(" ");

      message = message.replace("PLAYER", `<@${player.discordId}>`);
      message = message.replace("ENEMY", `**${this.getName()}**`);
      message = message.replace("DAMAGE", damageText + " damage");

      return message;
    };
  }
}

const enemies = await loadFiles("enemies", Enemy);

export default enemies;

// const oldEnemies = [
//   // small slime
//   new Enemy({
//     name: "small slime",
//     description: "A cute little guy. Would be a shame if you killed him.",
//     maxHealth: 3,
//     strength: 1,
//     defence: 1,
//     damage: {
//       min: 1,
//       max: 1,
//       type: "bludgeoning",
//     },
//     image: "https://imgur.com/HV0tsn9.png",
//     loot: [
//       {
//         name: "slimeball",
//         dropChance: 100,
//         min: 1,
//         max: 2,
//       },
//     ],
//     xp: {
//       min: 30,
//       max: 40,
//     },
//   }),
//   // big slime
//   new Enemy({
//     name: "big slime",
//     description: "How did a slime get this large? Try not to get swallowed.",
//     maxHealth: 5,
//     strength: 1,
//     defence: 1,
//     damage: {
//       min: 1,
//       max: 2,
//       type: "bludgeoning",
//     },
//     image: "https://imgur.com/HV0tsn9.png",
//     loot: [
//       {
//         name: "slimeball",
//         dropChance: 100,
//         min: 2,
//         max: 4,
//       },
//     ],
//     xp: {
//       min: 40,
//       max: 50,
//     },
//   }),
//   // burning slime
//   new Enemy({
//     name: "burning slime",
//     description: "The slime is constantly on fire... how?",
//     maxHealth: 4,
//     strength: 1,
//     defence: 1,
//     damage: {
//       min: 2,
//       max: 3,
//       type: "fire",
//     },
//     image: "https://imgur.com/HV0tsn9.png",
//     loot: [
//       {
//         name: "slimeball",
//         dropChance: 50,
//         min: 1,
//         max: 2,
//       },
//     ],
//     shard: {
//       dropChance: 20,
//       type: "grey",
//     },
//     xp: {
//       min: 40,
//       max: 50,
//     },
//   }),
//   // wet slime
//   new Enemy({
//     name: "wet slime",
//     description: "Somehow wet instead of sticky. Did it just have a bath?",
//     maxHealth: 4,
//     strength: 1,
//     defence: 1,
//     damage: {
//       min: 1,
//       max: 2,
//       type: "water",
//     },
//     image: "https://imgur.com/HV0tsn9.png",
//     loot: [
//       {
//         name: "slimeball",
//         dropChance: 100,
//         min: 1,
//         max: 2,
//       },
//     ],
//     xp: {
//       min: 30,
//       max: 40,
//     },
//   }),
//   // baby goblin
//   new Enemy({
//     name: "baby goblin",
//     description:
//       "Do not be fooled by its cute appearance. It will gladly eat you alive.",
//     maxHealth: 6,
//     strength: 3,
//     defence: 1,
//     damage: {
//       min: 2,
//       max: 3,
//       type: "bludgeoning",
//     },
//     image: "https://imgur.com/Fte78Qa.png",
//     loot: [
//       {
//         name: "goblin skin",
//         dropChance: 100,
//         min: 1,
//         max: 1,
//       },
//     ],
//     xp: {
//       min: 50,
//       max: 60,
//     },
//   }),
//   // hungry goblin
//   new Enemy({
//     name: "hungry goblin",
//     description: "Careful... they're dangerous when they're hungry.",
//     maxHealth: 8,
//     strength: 3,
//     defence: 1,
//     damage: {
//       min: 3,
//       max: 4,
//       type: "bludgeoning",
//     },
//     image: "https://imgur.com/Fte78Qa.png",
//     loot: [
//       {
//         name: "goblin skin",
//         dropChance: 100,
//         min: 1,
//         max: 2,
//       },
//     ],
//     xp: {
//       min: 60,
//       max: 70,
//     },
//   }),
//   // hobgoblin
//   new Enemy({
//     name: "hobgoblin",
//     description: "Do not enrage the hobgoblin. Bad idea.",
//     maxHealth: 10,
//     strength: 3,
//     defence: 1,
//     damage: {
//       min: 4,
//       max: 5,
//       type: "bludgeoning",
//     },
//     image: "https://imgur.com/Fte78Qa.png",
//     loot: [
//       {
//         name: "goblin skin",
//         dropChance: 100,
//         min: 1,
//         max: 2,
//       },
//     ],
//     shard: {
//       dropChance: 20,
//       type: "grey",
//     },
//     xp: {
//       min: 70,
//       max: 80,
//     },
//   }),
//   // rock
//   new Enemy({
//     name: "the rock",
//     description: "Rock.",
//     maxHealth: 30,
//     strength: 5,
//     defence: 1,
//     damage: {
//       min: 5,
//       max: 8,
//       type: "bludgeoning",
//     },
//     image: "https://imgur.com/Fte78Qa.png",
//     loot: [
//       {
//         name: "rock",
//         dropChance: 100,
//         min: 5,
//         max: 10,
//       },
//     ],
//     xp: {
//       min: 200,
//       max: 300,
//     },
//   }),
// ];
