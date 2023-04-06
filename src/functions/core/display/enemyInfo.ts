import { config, game } from "../../../tower.js";

/**
 * Get formatted enemy info from player in combat.
 */
export default async function enemyInfo(message: Message, player: Player) {
  if (!player.fighting) throw new Error("Player must be fighting an enemy.");

  const enemy = await player.getEnemy();

  const emojis = config.emojis.damage;
  const image = enemy.getImage();

  const strong = enemy.strong.map((x) => config.emojis.damage[x]).join(" ");
  const weak = enemy.weak.map((x) => config.emojis.damage[x]).join(" ");

  const title = enemy.getName() + ` (fighting ` + player.user.username + `)`;
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

  const embed: Embed = {
    description: description,
    // color: config.defaultEmbedColor,
    // author: {
    //   icon_url: player.user.pfp,
    //   name: title,
    // },
  };

  if (image) embed.thumbnail = { url: `attachment://${image.name}` };

  const botMessage = await game.fastEmbed({
    message,
    player,
    title,
    embed: embed,
    send: false,
    files: image ? [image] : [],
  });

  return botMessage;
}
