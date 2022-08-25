export default {
  enemyInfo: async (config, player) => {
    const enemy = await player.getCurrentEnemy();

    if (!enemy) return { embed: undefined, image: undefined };

    const emojis = config.emojis.damage;
    const image = enemy.getImage();

    const strong = enemy.strong.map((x) => config.emojis.damage[x]).join(" ");
    const weak = enemy.weak.map((x) => config.emojis.damage[x]).join(" ");

    const title = enemy.getName() + ` (fighting ` + player.username + `)`;
    let description = `
*${enemy.description}*
        
Level: \`${enemy.level}\`

${game.progressBar(enemy.health, enemy.maxHealth, "health")}
${config.emojis.health} \`${enemy.health} / ${enemy.maxHealth}\`
        
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
      color: config.botColor,
      author: {
        icon_url: player.pfp,
        name: title,
      },
    };

    if (image) embed.thumbnail = { url: `attachment://${image.name}` };

    return { embed, image };
  },
};
