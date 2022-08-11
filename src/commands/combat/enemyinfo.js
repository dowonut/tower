export default {
  name: "enemyinfo",
  aliases: ["ei"],
  description: "Get information about an enemy during combat.",
  category: "Combat",
  useInCombatOnly: true,
  async execute(message, args, prisma, config, player, game, server) {
    const enemy = await player.getCurrentEnemy();

    const emojis = config.emojis.damage;
    const image = enemy.getImage();

    const strong = enemy.strong.map((x) => config.emojis.damage[x]).join(" ");
    const weak = enemy.weak.map((x) => config.emojis.damage[x]).join(" ");

    const title = enemy.getName() + ` (fighting ` + player.username + `)`;
    let description = `
*${enemy.description}*
    
Level: \`${enemy.level}\`
    
${config.emojis.health} Health: \`${enemy.health} / ${enemy.maxHealth}\`
    
Strengths: ${strong}
Weaknesses: ${weak}

**Attacks:**`;

    // Format attacks
    const attacks = enemy.getAttacks();
    for (const attack of attacks) {
      const attackName = game.titleCase(attack.name);

      description += `\n\`${attackName}\` | `;

      for (const damage of attack.damage.damages) {
        let damageText = `${damage.min} - ${damage.max}`;
        if (damage.min == damage.max) damageText = `${damage.max}`;

        description += `\`${damageText}\`${emojis[damage.type]} `;
      }
    }

    const embed = {
      description: description,
    };

    if (image) embed.thumbnail = { url: `attachment://${image.name}` };

    game.fastEmbed(message, player, embed, title, image);
  },
};
