//import attacks from "../../game/attacks.js";

export default {
  name: "attack",
  aliases: ["a"],
  description: "Attack the enemy you're fighting.",
  arguments: "<attack name>",
  category: "Combat",
  useInCombat: true,
  cooldown: "2",
  async execute(message, args, prisma, config, player, game, server) {
    // Format imput
    const input = args.join(" ").toLowerCase();

    // Check if user specified attack
    if (args[0]) {
      // Check if player is in combat
      if (!player.inCombat)
        return game.error(message, "you can only use an attack during combat.");

      if (!isNaN(args[0]))
        return game.reply(
          message,
          "provide the name of the attack you want to use."
        );

      const attack = await player.getAttack(input);

      if (!attack) return game.reply(message, "not a valid attack.");

      if (attack.remCooldown > 0)
        return game.reply(message, "this attack is still on cooldown.");

      performAttack(message, config, player, game, server, attack, prisma);
    } else {
      listAttacks(message, config, player, game, server);
    }
  },
};

// List all attacks when no name is provided

async function listAttacks(message, config, player, game, server) {
  let description = ``;
  const attacks = await player.getAttacks();

  // Fetch enemy
  let enemy = await player.getCurrentEnemy();

  for (const attack of attacks) {
    const damageInfo = await attack.damageInfo(player, enemy);
    if (attack.remCooldown < 1) {
      description += `\n**${attack.getName()}** | ${attack.description}`;
      description += `\nDamage: ${damageInfo}`;

      if (attack.cooldown)
        description += `Cooldown: \`${attack.cooldown} rounds\`\n`;
    } else {
      description += `
:hourglass: *${attack.name} | ${attack.description}*
*Cooldown: \`${attack.remCooldown} rounds\`*\n`;
    }
  }

  const embed = {
    color: config.botColor,
    author: {
      icon_url: player.pfp,
      name: "Available Attacks",
    },
    description:
      description +
      `\n\n*Use an attack with \`${server.prefix}attack <name of attack>\`*`,
  };

  game.sendEmbed(message, embed);
}

// Perform attack after name is provided

async function performAttack(
  message,
  config,
  player,
  game,
  server,
  attack,
  prisma
) {
  let enemy = await player.getCurrentEnemy();

  const damage = await attack.getDamage(player, enemy);

  const remainingHealth =
    enemy.health - damage.total < 0 ? 0 : enemy.health - damage.total;
  let enemyAttack = enemy.chooseAttack(player);

  // Deal damage to enemy
  const enemyData = await player.updateEnemy({
    health: { increment: -damage.total },
  });

  // Fetch damage message
  const attackMessage = await attack.attackMessage(damage, enemy);
  // Format enemy health text
  const healthText = ` | ${config.emojis.health}\`${remainingHealth}/${enemy.maxHealth}\``;
  if (attackMessage) {
    await message.reply(attackMessage + healthText);
  } else {
    await game.reply(
      message,
      `You used **${attack.getName()}** dealing \`${damage}\`${
        config.emojis.damage[attack.damage.type]
      } damage to **${enemy.getName()}**${healthText}`
    );
  }

  const combatSkills = ["unarmed", "sword", "axe", "spear", "bow"];

  // Give skill xp
  for (const skill of combatSkills) {
    if (attack.type == skill) {
      const skillXp = game.random(5, 10);

      await player.giveSkillXp(skillXp, skill + " combat", message, game);
    }
  }

  // Send typing indicator
  await message.channel.sendTyping();

  // Update all cooldowns
  await player.prisma.attack.updateMany({
    where: {
      playerId: player.id,
      remCooldown: { gt: 0 },
    },
    data: { remCooldown: { increment: -1 } },
  });

  // Set attack cooldown
  let cooldown;
  if (attack.cooldown) {
    cooldown = attack.cooldown;
  } else {
    cooldown = 0;
  }

  // Put attack on cooldown
  await player.prisma.attack.updateMany({
    where: { playerId: player.id, name: attack.name },
    data: { remCooldown: cooldown },
  });

  // Run when enemy is dead
  if (enemyData.health <= 0) {
    // Remove enemy from database
    player.killEnemy();

    // Give loot to player
    player.enemyLoot(enemy, game, server, message);

    // Unlock new commands
    player.unlockCommands(message, server, ["inventory", "skills"]);

    // Exit out of combat
    return player.exitCombat();
  }

  // Get player damage
  enemyAttack.damage = await player.getDamageTaken(enemyAttack.damage, game);

  // Update player health
  const playerData = await player.update({
    health: { increment: -enemyAttack.damage.total },
    canAttack: false,
  });

  // Deal damage to player
  setTimeout(async () => {
    // Warn low health
    let healthWarning =
      (playerData.health / player.maxHealth) * 100 < 33
        ? ` | :warning: **Low Health!**`
        : ``;

    // Format attack message
    const attackMessage = enemy.attackMessage(enemyAttack, player);
    const healthMessage = ` | ${config.emojis.health}\`${playerData.health}/${player.maxHealth}\`${healthWarning}`;

    // Send if exists else send default
    if (attackMessage) {
      //message.channel.send(attackMessage + healthMessage);
      game.reply(message, attackMessage + healthMessage);
    } else {
      message.channel.send(
        `**${enemy.getName()}** deals \`${enemyAttack.damage}\`${
          config.emojis.damage[enemyAttack.type]
        } damage to **${message.author}**`
      );
    }

    await player.update({ canAttack: true });

    // check if player is dead
    if (playerData.health <= 0) {
      message.reply(
        `:skull_crossbones: ${message.author} **you have died!** :skull_crossbones:\nYour character has been completely reset. Try not to die again.`
      );

      await player.erase();
      return game.createPlayer(
        message.author,
        prisma,
        game,
        player.unlockedCommands
      );
    }
  }, game.random(500, 2000));
}
