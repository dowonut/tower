//import attacks from "../../game/attacks.js";

export default {
  name: "attack",
  aliases: ["a"],
  description: "Attack the enemy you're fighting.",
  arguments: "<attack name>",
  category: "Combat",
  useInCombat: true,
  cooldown: "1",
  async execute(message, args, config, player, server) {
    // Format imput
    const input = args.join(" ").toLowerCase();

    // Check if user specified attack
    if (args[0]) {
      // Check if player is in combat
      if (!player.inCombat)
        return game.error(message, "you can only use an attack during combat.");

      if (!player.canAttack)
        return game.error(message, "you can't attack right now.");

      if (!isNaN(args[0]))
        return game.error(
          message,
          "provide the name of the attack you want to use."
        );

      const attack = await player.getAttack(input);

      if (!attack) return game.error(message, "not a valid attack.");

      if (attack.remCooldown > 0)
        return game.error(message, "this attack is still on cooldown.");

      return await performAttack(message, config, player, server, attack);
    } else {
      return await listAttacks(message, config, player);
    }
  },
};

// List all attacks when no name is provided

async function listAttacks(message, config, player) {
  let description = ``;
  const attacks = await player.getAttacks();

  // Fetch enemy
  let enemy = await player.getCurrentEnemy();

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

  const embed = {
    color: config.botColor,
    author: {
      icon_url: player.pfp,
      name: "Available Attacks",
    },
    description: description,
  };

  game.sendEmbed(message, embed);
}

// Perform attack after name is provided

async function performAttack(message, config, player, server, attack) {
  await player.update({ canAttack: false });

  // Get current enemy
  let enemy = await player.getCurrentEnemy();

  // Get damage from attack
  const damage = await attack.getDamage(player, enemy);

  // Get chosen attack from enemy
  let enemyAttack = enemy.chooseAttack(player);

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
  await game.reply(message, attackMessage, false);

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
  let cooldown;
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
    const { reply, levelReply } = await player.enemyLoot(
      enemy,
      server,
      message
    );

    // Add explore button
    game.cmdButton(message, reply, ["explore", message, [], server]);

    // Add stats button
    if (levelReply) {
      game.cmdButton(message, levelReply, ["stats", message, [], server]);
    }

    // Unlock new commands
    player.unlockCommands(message, server, ["inventory", "skills"]);

    // Exit out of combat
    player.exitCombat();

    return "KILLED_ENEMY";
  }

  // Get player damage
  enemyAttack.damage = await player.getDamageTaken(enemyAttack.damage);

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
      game.reply(message, attackMessage, false);

      await player.update({ canAttack: true });

      // Check if player is dead
      if (playerData.health <= 0) {
        const deathMessage = `:skull_crossbones: **\`You died!\`** :skull_crossbones:`;

        await game.reply(message, deathMessage, true, config.red, "");

        await player.erase();
        await game.createPlayer(message.author, player.unlockedCommands);

        resolve("KILLED_PLAYER");
      }
      resolve(undefined);
    }, game.random(500, 2000));
  });

  // Function to get attack message
  function getAttackMessage(object) {
    const { enemy, damage, player, attack } = object;
    let attackMsg;
    let healthText;
    let statTitle;
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
