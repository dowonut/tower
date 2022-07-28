//import attacks from "../../game/attacks.js";

export default {
  name: "attack",
  aliases: ["a"],
  description: "Attack the enemy you're fighting.",
  arguments: "<attack name>",
  category: "Combat",
  useInCombatOnly: true,
  cooldown: "1",
  async execute(message, args, prisma, config, player, game, server) {
    // Format imput
    const input = args.join(" ").toLowerCase();

    // Check if user specified attack
    if (args[0]) {
      if (!isNaN(args[0]))
        return game.reply(
          message,
          "provide the name of the attack you want to use."
        );

      const attack = await player.getAttack(input);

      if (!attack) return game.reply(message, "not a valid attack.");

      if (attack.remCooldown > 0)
        return game.reply(message, "this attack is still on cooldown.");

      performAttack(message, config, player, game, server, attack);
    } else {
      listAttacks(message, config, player, game, server);
    }
  },
};

// List all attacks when no name is provided

async function listAttacks(message, config, player, game, server) {
  let description = ``;
  const attacks = await player.getAttacks();

  for (const [attackName, attack] of Object.entries(attacks)) {
    if (attack.remCooldown < 1) {
      description += `
**${attack.name}** | ${attack.description}
Damage: ${attack.damageInfo(player)}\n`;

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

async function performAttack(message, config, player, game, server, attack) {
  let enemy = await player.getCurrentEnemy();

  const damage = attack.damage(player);
  const remainingHealth = enemy.health - damage < 0 ? 0 : enemy.health - damage;
  const enemyDamage = enemy.damage();

  // Deal damage to enemy
  const enemyData = await player.updateEnemy({
    health: { increment: -damage },
  });

  // Send damage message
  await message.channel.send(
    `**${player.username}** used **${attack.name}** dealing \`${damage}\`${
      config.emojis.damage[attack.damageType]
    } damage to **${enemy.name}** | :drop_of_blood:\`${remainingHealth}/${
      enemy.maxHealth
    }\``
  );

  // Send typing indicator
  await message.channel.sendTyping();

  // Update all cooldowns
  const newAttacks = await player.prisma.attack.updateMany({
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
    player.killEnemy(enemy);

    // Unlock new commands
    player.unlockCommands(message, server, ["inventory", "iteminfo"]);

    // Give loot to player
    player.enemyLoot(enemy, game, server, message);

    // Exit out of combat
    return player.exitCombat();
  }

  // Update player health
  const playerData = await player.update({
    health: { increment: -enemyDamage },
    canAttack: false,
  });

  // Deal damage to player
  setTimeout(async () => {
    message.channel.send(
      `**${enemy.name}** deals \`${enemyDamage}\` damage to **${player.username}** | :drop_of_blood:\`${playerData.health}/${player.maxHealth}\``
    );

    await player.update({ canAttack: true });

    // check if player is dead
    if (playerData.health <= 0) {
      message.channel.send(
        `:skull_crossbones: ${message.author} **you have died!** :skull_crossbones:\nYour character has been completely reset. Try not to die again.`
      );

      return player.erase();
    }
  }, game.random(1000, 3000));
}
