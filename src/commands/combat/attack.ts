import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "attack",
  aliases: ["a"],
  description: "Attack the enemy you're fighting.",
  arguments: [
    { name: "attack_name", type: "playerAvailableAttack", required: false },
  ],
  category: "combat",
  useInCombat: true,
  cooldown: "1",
  async execute(message, args, player, server) {
    // Format imput
    const input = args.attack_name;

    // Check if user specified attack
    if (args.attack_name) {
      // Check if player is in combat
      if (!player.inCombat)
        return game.error({
          message,
          content: "you can only use an attack during combat.",
        });

      if (!player.canAttack)
        return game.error({ message, content: "you can't attack right now." });

      // if (!isNaN(args[0]))
      //   return game.error({
      //     message,
      //     content: "provide the name of the attack you want to use.",
      //   });

      const attack = await player.getAttack(input);

      // if (!attack)
      //   return game.error({ message, content: "not a valid attack." });

      if (attack.remCooldown > 0)
        return game.error({
          message,
          content: "this attack is still on cooldown.",
        });

      return await performAttack(message, player, server, attack);
    } else {
      return await listAttacks(message, player);
    }
  },
} as Command;

// List all attacks when no name is provided

async function listAttacks(message: Message, player: Player) {
  let description = ``;
  const attacks = await player.getAttacks();

  // Fetch enemy
  let enemy = await player.getEnemy();

  for (const attack of attacks) {
    const damageInfo = await attack.damageInfo(player, enemy);
    if (attack.remCooldown < 1) {
      description += `\n\n**${attack.getName()}** | ${attack.description}`;
      description += `\nDamage: ${damageInfo}`;

      if (attack.cooldown)
        description += `\nCooldown: \`${attack.cooldown} rounds\``;
    } else {
      description += `
\n:hourglass: *${attack.getName()} | Cooldown: \`${
        attack.remCooldown
      } rounds\`*`;
    }
  }

  // Add tutorial if in combat
  if (player.inCombat) {
    //description += `\n\n*Use an attack with \`${server.prefix}attack <name of attack>\`*`;
  }

  game.fastEmbed({ message, title: "Available Attacks", description, player });
}

// Perform attack after name is provided

async function performAttack(
  message: Message,
  player: Player,
  server: Server,
  attack: Attack
) {
  await player.update({ canAttack: false });

  // Get current enemy
  let enemy = await player.getEnemy();

  // Get damage from attack
  const damage = await attack.getDamage(player, enemy);

  // Get chosen attack from enemy
  let baseEnemyAttack = enemy.chooseAttack(player);

  // Deal damage to enemy
  const enemyData = await player.updateEnemy({
    health: { increment: -damage.total },
  });
  enemy.health = enemyData.health;

  // Get attack message
  const attackMessage = getAttackMessage({
    source: "player",
    damage: damage,
    enemy: enemy,
    attack: attack,
  });

  // Send attack message
  await game.send({ message, content: attackMessage, reply: true });

  const combatSkills = ["unarmed", "sword", "axe", "spear", "bow"];

  // Update all cooldowns
  await prisma.attack.updateMany({
    where: {
      playerId: player.id,
      remCooldown: { gt: 0 },
    },
    data: { remCooldown: { increment: -1 } },
  });

  // Set attack cooldown
  let cooldown: number;
  if (attack.cooldown) {
    cooldown = attack.cooldown;
  } else {
    cooldown = 0;
  }

  // Put attack on cooldown
  await prisma.attack.updateMany({
    where: { playerId: player.id, name: attack.name },
    data: { remCooldown: cooldown },
  });

  // Update passive modifiers
  await player.updatePassives();

  // Give skill xp
  game.events.emit("attackUse", { attack: attack, player: player });

  // Run when enemy is dead
  if (enemyData.health <= 0) {
    // Remove enemy from database
    player.killEnemy();

    // Give loot to player
    const { reply, levelReply } = await player.giveEnemyLoot({
      enemy,
      server,
      message,
    });

    // Add explore button
    game.commandButton({ message, reply, server, command: "explore" });

    // Add stats button
    if (levelReply) {
      game.commandButton({
        server,
        message,
        reply: levelReply,
        command: "stats",
      });
    }

    // Unlock new commands
    player.unlockCommands(message, ["inventory", "skills"]);

    // Exit out of combat
    player.exitCombat();

    return "KILLED_ENEMY";
  }

  // Get player damage
  let enemyAttack = await player.getDamageTaken(baseEnemyAttack);

  // Update player health
  const playerData = await player.update({
    health: { increment: -enemyAttack.damage.total },
  });
  player.health = playerData.health;

  // Send typing indicator
  await message.channel.sendTyping();

  // Deal damage to player
  return new Promise((resolve) => {
    setTimeout(async () => {
      // Get attack message
      const attackMessage = getAttackMessage({
        source: "enemy",
        attack: enemyAttack,
        player: player,
        enemy: enemy,
      });

      // Send attack message
      game.send({ message, content: attackMessage, reply: true });

      await player.update({ canAttack: true });

      // Check if player is dead
      if (playerData.health <= 0) {
        const deathMessage = `:skull_crossbones: **\`You died!\`** :skull_crossbones:`;

        await game.send({ message, content: deathMessage, reply: true });

        console.log("erasing player...");
        await player.erase();
        await game.createPlayer(
          message.author,
          server,
          player.user.unlockedCommands
        );

        resolve("KILLED_PLAYER");
      }
      resolve(undefined);
    }, game.random(500, 2000));
  });

  // Function to get attack message
  function getAttackMessage(object) {
    const { enemy, damage, player, attack } = object;
    let attackMsg: string;
    let healthText: string;
    let statTitle: string;
    const healthE = config.emojis.health;
    // If player is attacking
    if (object.source == "player") {
      // Fetch base attack message
      attackMsg = attack.attackMessage(damage, enemy);

      // Format enemy health text
      const healthBar = game.progressBar(
        enemy.health,
        enemy.maxHealth,
        "health"
      );
      statTitle = `**${enemy.getName()}'s Health**`;
      healthText = `${healthE} ${healthBar} \`${enemy.health}/${enemy.maxHealth}\``;
    }
    // If enemy is attacking
    else if (object.source == "enemy") {
      // Fetch base attack message
      attackMsg = enemy.attackMessage(attack, player);
      // Define health warning
      const healthWarning =
        (player.health / player.maxHealth) * 100 < 33
          ? `:warning: **Low Health!**`
          : ``;
      // Format player health text
      const healthBar = game.progressBar(
        player.health,
        player.maxHealth,
        "health"
      );
      statTitle = `**${player.username}'s Health** ${healthWarning}`;
      healthText = `${healthE} ${healthBar} \`${player.health}/${player.maxHealth}\``;
      healthText += `\n${healthWarning}`;
    }
    // Start building final message
    let message = attackMsg;
    // Add seperator
    message += "\n───────────────";
    //message += `\n${statTitle}`;
    message += `\n${healthText}`;

    // Return with message
    return message;
  }
}
