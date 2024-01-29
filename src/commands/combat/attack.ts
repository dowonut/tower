import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "attack",
  aliases: ["a"],
  description: "Attack the enemy you're fighting.",
  arguments: [
    { name: "attackName", type: "playerAvailableAttack", required: false },
    {
      name: "targetName",
      required: false,
      async filter(i, p) {
        const enemies = await p.getEnemies();
        const players = await p.getPartyPlayers();

        const target = enemies.find((x) => {
          return x.name == i.toLowerCase() || parseInt(i) == x.number;
        });

        if (!target || !enemies) {
          return { success: false, message: `No enemy found with name or number ${game.f(i)}` };
        }

        return { success: true, content: { players, enemies, target } };
      },
    },
  ],
  category: "combat",
  useInCombat: true,
  cooldown: "2",
  async execute(
    message,
    args: {
      attackName: string;
      targetName?: { players?: Player[]; enemies?: Enemy[]; target: Enemy | Player };
    },
    player
  ) {
    // Format imput
    let { attackName, targetName } = args;
    let { players = [], enemies = [], target = undefined } = targetName;

    const attacks = await player.getActions({ type: "weapon_attack" });

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
                name: `${attack.getEmoji()} **${attack.getName()}** | ${game.f(
                  `Lvl. ${attack.level}`
                )}`,
                value: description,
                inline: true,
              });
              if (i % 2 == 0) fields.push({ name: "** **", value: "** **" });
              i++;
            }

            return game.fastEmbed({
              player,
              title,
              embed: { fields },
              fullSend: false,
              reply: true,
            });
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
      if (!player.canTakeAction)
        return game.error({ player, content: `you can't attack right now.` });
      // Check if enemy provided
      if (!target || (!enemies && !players))
        return game.error({
          player,
          content: `provide the name or number of the enemy you want to attack.`,
        });

      let attack = await player.getAction(attackName);

      // Check if attack is on cooldown
      if (attack?.remCooldown > 0) {
        return game.error({
          player,
          content: `this attack is still on cooldown!\n${game.f(
            attack.remCooldown
          )} turns remaining.`,
        });
      }

      // Evaluate attack
      const evaluatedAction = await game.evaluateAction({
        action: attack,
        enemies,
        source: player,
        target,
      });
      if (evaluatedAction.enemies) Object.assign(enemies, evaluatedAction.enemies);
      if (evaluatedAction.players) Object.assign(players, evaluatedAction.players);

      if (attack.cooldown) {
        // Update remaining cooldown
        attack = await attack.update({ remCooldown: attack.cooldown + 1 });
      }

      // Send emitter
      game.emitter.emit("playerMove", {
        encounterId: player.encounterId,
        player,
        enemies,
        players,
      } satisfies PlayerMoveEmitter);

      // Give skill xp
      for (const weaponType of attack.requiredWeapon) {
        await player.giveSkillXP({
          skillName: weaponType + " combat",
          amount: game.random(10, 20),
        });
      }
    }
  },
} as Command;

/** Perform an attack. */
// async function performAttack(args: {
//   player: Player;
//   target: Enemy;
//   enemies: Enemy[];
//   attackName: string;
// }) {
//   let { player, target, enemies, attackName } = args;

//   // Check if player can attack
//   if (!player.canTakeAction) return game.error({ player, content: `you can't attack right now.` });
//   // Check if enemy provided
//   if (!target || !enemies)
//     return game.error({
//       player,
//       content: `provide the name or number of the enemy you want to attack.`,
//     });

//   let attack = await player.getAction(attackName);

//   // Check if attack is on cooldown
//   if (attack?.remCooldown > 0) {
//     return game.error({
//       player,
//       content: `this attack is still on cooldown!\n${game.f(attack.remCooldown)} turns remaining.`,
//     });
//   }

//   let attackMessages: string[] = [];

//   // Iterate through damage instances and process
//   for (let attackDamage of attack.damage) {
//     if (!attackDamage.targets) attackDamage.targets = [];
//     // Define targets per damage instance
//     switch (attackDamage.targetType) {
//       // Single target
//       case "single":
//         attackDamage.targets.push(target);
//         break;
//       // Adjacent targets
//       case "adjacent":
//         if (target.number == 1) {
//           attackDamage.targets.push(enemies.find((x) => x.number == target.number + 1));
//         } else if (target.number == enemies.length) {
//           attackDamage.targets.push(enemies.find((x) => x.number == target.number - 1));
//         } else {
//           attackDamage.targets.push(enemies.find((x) => x.number == target.number + 1));
//           attackDamage.targets.push(enemies.find((x) => x.number == target.number - 1));
//         }
//         break;
//       // All targets
//       case "all":
//         attackDamage.targets.push(...enemies);
//         break;
//       // Specific targets
//       case "choose":
//         break;
//     }

//     // Evaluate damage instance against all targets
//     const evaluatedDamageInstance = await game.evaluateDamageInstance({
//       damage: attackDamage,
//       source: player,
//     });

//     // Evaluate damage and target
//     for (let instance of evaluatedDamageInstance.targets) {
//       let target = instance.target as Enemy;
//       // Get damage from attack
//       const totalDamage = instance.total;
//       const previousEnemyHealth = target.health;
//       // Update enemy
//       const dead = target.health - totalDamage < 1 ? true : false;
//       target = await target.update({ health: { increment: -totalDamage }, dead });
//     }

//     // Get attack message
//     const attackMessage = game.getAttackMessage({
//       attack,
//       damage,
//       enemy: target,
//       player,
//       source: "player",
//       previousHealth: previousEnemyHealth,
//     });
//   }

// Update remaining cooldown
// if (attack.cooldown) {
//   attack = await attack.update({ remCooldown: attack.cooldown });
// }

// Send emitter
// game.emitter.emit("playerMove", {
//   encounterId: player.encounterId,
//   player,
//   enemies,
//   attackMessage,
// } satisfies EmitterArgs);

// Give skill xp
// for (const weaponType of attack.weaponType) {
//   await player.giveSkillXP({ skillName: weaponType + " combat", amount: game.random(10, 20) });
// }
// }
