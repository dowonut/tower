import attacks from "../../game/attacks.js";

export default {
  name: "attack",
  aliases: ["a"],
  description:
    "Attack the enemy you're fighting. Leave out arguments to list available attacks.",
  arguments: "<name of attack>",
  category: "Combat",
  useInCombatOnly: true,
  async execute(message, args, prisma, config, player, game, server) {
    let attack;

    if (args[0]) {
      if (!isNaN(args[0]))
        return game.reply(
          message,
          "provide the name of the attack you want to use."
        );

      if (attacks[args[0].toLowerCase()]) attack = args[0];
      else {
        return game.reply(message, "not a valid attack.");
      }
    }

    if (!attack)
      listAttacks(message, args, prisma, config, player, game, server);
    else performAttack(message, args, prisma, config, player, game, server);
  },
};

// List all attacks when no name is provided

async function listAttacks(
  message,
  args,
  prisma,
  config,
  player,
  game,
  server
) {
  let description = ``;

  for (const [attackName, attack] of Object.entries(attacks)) {
    description += `
**${attack.name}** | ${attack.description}
Damage: \`${attack.damageInfo}\`\n`;

    if (attack.cooldown)
      description += `Cooldown: \`${attack.cooldown} seconds\`\n`;
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

async function performAttack(
  message,
  args,
  prisma,
  config,
  player,
  game,
  server
) {
  let enemy = await player.getCurrentEnemy();

  const attack = attacks[args[0].toLowerCase()];

  const damage = attack.damage(player.strength);
  const remainingHealth = enemy.health - damage < 0 ? 0 : enemy.health - damage;

  game.reply(
    message,
    `you deal **${damage}** damage to **${enemy.name}** (${remainingHealth}/${enemy.maxHealth} HP).`
  );

  const enemyData = await player.updateEnemy({
    health: { increment: -damage },
  });

  // Run when enemy is dead
  if (enemyData.health <= 0) {
    // Remove enemy from database
    player.killEnemy(enemy);

    // Give loot to player
    player.enemyLoot(enemy, game, message);

    // Exit out of combat
    player.exitCombat();
  }
}
