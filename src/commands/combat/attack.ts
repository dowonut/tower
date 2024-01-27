import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "attack",
  aliases: ["a"],
  description: "Attack the enemy you're fighting.",
  arguments: [
    { name: "attackName", type: "playerAvailableAttack", required: false },
    {
      name: "targetEnemy",
      required: false,
      async filter(i, p) {
        const enemies = await p.getEnemies();

        const target = enemies.find((x) => {
          return x.name == i.toLowerCase() || parseInt(i) == x.number;
        });

        if (!target) {
          return { success: false, message: `No enemy found with name or number ${game.f(i)}` };
        }

        return { success: true, content: { enemies, target } };
      },
    },
  ],
  category: "combat",
  useInCombat: true,
  cooldown: "2",
  async execute(
    message,
    args: { attackName: string; targetEnemy: { enemies: Enemy[]; target: Enemy } },
    player,
    server
  ) {
    // Format imput
    let { attackName, targetEnemy } = args;
    let { enemies, target } = targetEnemy;

    const attacks = await player.getAttacks();

    const menu = new game.Menu({
      player,
      boards: [{ name: "attacks", rows: [], message: "attacks" }],
      rows: [],
      messages: [
        {
          name: "attacks",
          function: (m) => {
            const title = `Attacks`;
            let fields: Embed["fields"] = [];
            let i = 1;
            for (const attack of attacks) {
              let description = "└ " + attack.getDamageText();
              if (attack.cooldown) {
                description += `└ ` + attack.getCooldownText();
              }

              fields.push({
                name: `${attack.getEmoji()} **${attack.getName()}** | ${game.f(`Lvl. ${attack.level}`)}`,
                value: description,
                inline: true,
              });
              if (i % 2 == 0) fields.push({ name: "** **", value: "** **" });
              i++;
            }

            return game.fastEmbed({ player, title, embed: { fields }, fullSend: false, reply: true });
          },
        },
      ],
    });

    // List attacks
    if (!attackName) {
      menu.init("attacks");
    }

    // Perform attack
    else {
      // Check if player can attack
      if (!player.canAttack) return game.error({ player, content: `you can't attack right now.` });
      // Check if enemy provided
      if (!target)
        return game.error({ player, content: `provide the name or number of the enemy you want to attack.` });

      let attack = await player.getAttack(attackName);

      // Check if attack is on cooldown
      if (attack?.remCooldown > 0) {
        return game.error({
          player,
          content: `this attack is still on cooldown!\n${game.f(attack.remCooldown)} turns remaining.`,
        });
      }

      // Get damage from attack
      const damage = await game.evaluateAttack({ attack, source: player, target });
      const totalDamage = damage.total;
      const previousEnemyHealth = target.health;

      // Update enemy
      const dead = target.health - totalDamage < 1 ? true : false;
      console.log("target health: ", target.health);
      console.log("total damage: ", totalDamage);
      console.log("dead? ", dead);
      target = await target.update({ health: { increment: -totalDamage }, dead });

      // Update remaining cooldown
      if (attack.cooldown) {
        attack = await attack.update({ remCooldown: attack.cooldown });
      }

      const attackMessage = game.getAttackMessage({
        attack,
        damage,
        enemy: target,
        player,
        source: "player",
        previousHealth: previousEnemyHealth,
      });

      // Send emitter
      game.emitter.emit("playerMove", {
        encounterId: player.encounterId,
        player,
        enemies,
        attackMessage,
      } satisfies EmitterArgs);

      // Give skill xp
      for (const weaponType of attack.weaponType) {
        await player.giveSkillXP({ skillName: weaponType + " combat", amount: game.random(20, 30) });
      }
    }

    //   // Check if user specified attack
    //   if (args.attack_name) {
    //     // Check if player is in combat
    //     if (!player.inCombat)
    //       return game.error({
    //         message,
    //         content: "you can only use an attack during combat.",
    //       });

    //     if (!player.canAttack)
    //       return game.error({ message, content: "you can't attack right now." });

    //     // if (!isNaN(args[0]))
    //     //   return game.error({
    //     //     message,
    //     //     content: "provide the name of the attack you want to use.",
    //     //   });

    //     const attack = await player.getAttack(input);

    //     // if (!attack)
    //     //   return game.error({ message, content: "not a valid attack." });

    //     if (attack.remCooldown > 0)
    //       return game.error({
    //         message,
    //         content: "this attack is still on cooldown.",
    //       });

    //     // return await performAttack(message, player, server, attack);
    //   } else {
    //     // return await listAttacks(message, player);
    //   }
  },
} as Command;

// List all attacks when no name is provided

// async function listAttacks(message: Message, player: Player) {
//   let description = ``;
//   const attacks = await player.getAttacks();

//   // Fetch enemy
//   let enemy = await player.getEnemy();

//   for (const attack of attacks) {
//     const damageInfo = await attack.damageInfo(player, enemy);
//     if (attack.remCooldown < 1) {
//       description += `\n\n**${attack.getName()}** | ${attack.description}`;
//       description += `\nDamage: ${damageInfo}`;

//       if (attack.cooldown)
//         description += `\nCooldown: \`${attack.cooldown} rounds\``;
//     } else {
//       description += `
// \n:hourglass: *${attack.getName()} | Cooldown: \`${
//         attack.remCooldown
//       } rounds\`*`;
//     }
//   }

//   // Add tutorial if in combat
//   if (player.inCombat) {
//     //description += `\n\n*Use an attack with \`${server.prefix}attack <name of attack>\`*`;
//   }

//   game.fastEmbed({ message, title: "Available Attacks", description, player });
// }

// // Perform attack after name is provided

// async function performAttack(
//   message: Message,
//   player: Player,
//   server: Server,
//   attack: Attack
// ) {
//   await player.update({ canAttack: false });

//   // Get current enemy
//   let enemy = await player.getEnemy();

//   // Save health before attack
//   let enemyPreviousHealth = enemy.health;

//   // Get damage from attack
//   const damage = await attack.getDamage(player, enemy);

//   // Get chosen attack from enemy
//   let baseEnemyAttack = enemy.chooseAttack(player);

//   // Deal damage to enemy
//   const enemyData = await player.updateEnemy({
//     health: { increment: -damage.total },
//   })
//   enemy.health = enemyData.health;

//   // Get attack message
//   const attackMessage = getAttackMessage({
//     source: "player",
//     damage: damage,
//     enemy: enemy,
//     attack: attack,
//     enemyPreviousHealth,
//   });

//   // Send attack message
//   await game.send({ message, content: attackMessage, reply: true });

//   const combatSkills = ["unarmed", "sword", "axe", "spear", "bow"];

//   // Update all cooldowns
//   await prisma.attack.updateMany({
//     where: {
//       playerId: player.id,
//       remCooldown: { gt: 0 },
//     },
//     data: { remCooldown: { increment: -1 } },
//   });

//   // Set attack cooldown
//   let cooldown: number;
//   if (attack.cooldown) {
//     cooldown = attack.cooldown;
//   } else {
//     cooldown = 0;
//   }

//   // Put attack on cooldown
//   await prisma.attack.updateMany({
//     where: { playerId: player.id, name: attack.name },
//     data: { remCooldown: cooldown },
//   });

//   // Update passive modifiers
//   await player.updatePassives();

//   // Give skill xp
//   game.events.emit("attackUse", { attack: attack, player: player });

//   // Run when enemy is dead
//   if (enemyData.health <= 0) {
//     // Remove enemy from database
//     player.killEnemy();

//     // Give loot to player
//     const { reply, levelReply } = await player.giveEnemyLoot({
//       enemy,
//       server,
//       message,
//     });

//     // Add explore button
//     game.commandButton({ message, reply, server, command: "explore" });

//     // Add stats button
//     if (levelReply) {
//       game.commandButton({
//         server,
//         message,
//         reply: levelReply,
//         command: "stats",
//       });
//     }

//     // Unlock new commands
//     player.unlockCommands(message, ["inventory", "skills"]);

//     // Exit out of combat
//     player.exitCombat();

//     return "KILLED_ENEMY";
//   }

//   // Get player damage
//   let enemyAttack = await player.getDamageTaken(baseEnemyAttack);

//   // Update player health
//   const playerData = await player.update({
//     health: { increment: -enemyAttack.damage.total },
//   });
//   const previousHealth = player.health;
//   player.health = playerData.health;

//   // Send typing indicator
//   await message.channel.sendTyping();

//   // Deal damage to player
//   return new Promise((resolve) => {
//     setTimeout(async () => {
//       // Get attack message
//       const attackMessage = getAttackMessage({
//         source: "enemy",
//         attack: enemyAttack,
//         player: player,
//         enemy: enemy,
//         previousHealth,
//       });

//       // Send attack message
//       game.send({ message, content: attackMessage, reply: true });

//       await player.update({ canAttack: true });

//       // Check if player is dead
//       if (playerData.health <= 0) {
//         const { marks, region } = await player.die();

//         const deathMessage = `
// :skull_crossbones: **You died!** :skull_crossbones:\n\`-20%\` ${
//           config.emojis.mark
//         } (Remaining: \`${marks}\`)\nReturned to \`${game.titleCase(region)}\``;

//         await game.send({ message, content: deathMessage, reply: true });

//         // console.log("erasing player...");
//         // await player.erase();
//         // await game.createPlayer(message.author, server);

//         resolve("KILLED_PLAYER");
//       }
//       resolve(undefined);
//     }, game.random(500, 2000));
//   });

//   // Function to get attack message
//   function getAttackMessage(object: {
//     source: "player" | "enemy";
//     damage?: {};
//     enemy: Enemy;
//     attack: Attack | EnemyEvaluatedAttack;
//     player?: Player;
//     previousHealth?: number;
//     enemyPreviousHealth?: number;
//   }) {
//     const {
//       enemy,
//       damage,
//       player,
//       attack,
//       previousHealth,
//       enemyPreviousHealth,
//     } = object;
//     const { embedVariable: format } = game;
//     let attackMsg: string;
//     let healthText: string;
//     let statTitle: string;
//     const healthE = config.emojis.health;
//     // If player is attacking
//     if (object.source == "player") {
//       // Fetch base attack message
//       attackMsg = (attack as Attack).attackMessage(damage, enemy);

//       // Format enemy health text
//       const healthBar = game.progressBar({
//         min: enemy.health,
//         max: enemy.maxHP,
//         minPrevious: enemyPreviousHealth,
//         type: "orange",
//       });
//       healthText = `
// ${healthE} ${format(`${enemy.health} / ${enemy.maxHP}`)}
// ${healthBar}`;
//     }
//     // If enemy is attacking
//     else if (object.source == "enemy") {
//       // Fetch base attack message
//       attackMsg = enemy.attackMessage(attack as EnemyEvaluatedAttack, player);
//       // Define health warning
//       const healthWarning =
//         (player.health / player.maxHP) * 100 < 33
//           ? `:warning: **Low Health!**`
//           : ``;
//       // Format player health text
//       const healthBar = game.progressBar({
//         min: player.health,
//         max: player.maxHP,
//         minPrevious: previousHealth,
//         type: "red",
//       });
//       healthText = `
// ${healthE} ${format(`${player.health} / ${player.maxHP}`)}
// ${healthBar}`;
//       // healthText += `\n${healthWarning}`;
//     }
//     // Start building final message
//     let message = attackMsg;
//     // Add seperator
//     // message += "\n───────────────";
//     //message += `\n${statTitle}`;
//     message += `\n${healthText}`;

//     // Return with message
//     return message;
//   }
// }
