//import attacks from "../../game/attacks.js";

export default {
  name: "attack",
  aliases: ["a"],
  description: "Attack the enemy you're fighting.",
  arguments: "<attack name>",
  category: "Combat",
  useInCombat: true,
  cooldown: "1",
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

  for (const [attackName, attack] of Object.entries(attacks)) {
    if (attack.remCooldown < 1) {
      description += `
**${attack.getName()}** | ${attack.description}
Damage: ${await attack.damageInfo(player)}\n`;

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
    description: description,
    //+ `\n*Use an attack with \`${server.prefix}attack <name of attack>\`*`,
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

  const damage = await attack.getDamage(player);
  const remainingHealth = enemy.health - damage < 0 ? 0 : enemy.health - damage;
  let enemyDamage = enemy.getDamage();

  // Deal damage to enemy
  const enemyData = await player.updateEnemy({
    health: { increment: -damage },
  });

  // Send damage message
  await message.channel.send(
    `**${player.username}** used **${attack.getName()}** dealing \`${damage}\`${
      config.emojis.damage[attack.damage.type]
    } damage to **${enemy.getName()}** | ${
      config.emojis.health
    }\`${remainingHealth}/${enemy.maxHealth}\``
  );

  // Give skill xp
  if (attack.type == "unarmed") {
    const skillXp = game.random(5, 10);

    await player.giveSkillXp(skillXp, "unarmed combat", message, game);
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
  enemyDamage = await player.getDamageTaken(enemyDamage);

  // Update player health
  const playerData = await player.update({
    health: { increment: -enemyDamage.value },
    canAttack: false,
  });

  // Deal damage to player
  setTimeout(async () => {
    // Warn low health
    let healthWarning =
      (playerData.health / player.maxHealth) * 100 < 33
        ? ` | :warning: **Low Health!**`
        : ``;

    message.channel.send(
      `**${enemy.getName()}** deals \`${enemyDamage.value}\`${
        config.emojis.damage[enemyDamage.type]
      } damage to **${player.username}** | ${config.emojis.health}\`${
        playerData.health
      }/${player.maxHealth}\`${healthWarning}`
    );

    await player.update({ canAttack: true });

    // check if player is dead
    if (playerData.health <= 0) {
      message.channel.send(
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
  }, game.random(1000, 3000));
}
