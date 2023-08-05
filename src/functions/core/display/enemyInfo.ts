import { config, game } from "../../../tower.js";

/**
 * Get formatted enemy info from player in combat.
 */
export default async function enemyInfo(args: {
  message: Message;
  player: Player;
  enemyData?: Enemy;
  /** Shows all info. Default: true. */
  verbose?: boolean;
}) {
  const { message, player, enemyData, verbose = true } = args;

  if (!player.inCombat && !enemyData) throw new Error("Player must be fighting an enemy.");

  let enemy: Enemy;
  if (player.inCombat) {
    // enemy = await player.getEnemy();
  } else {
    enemy = enemyData;
    enemy.health = enemy.maxHP;
  }

  const emojis = config.emojis.damage;
  const image = enemy.getImage();

  const strong = enemy.strong.map((x) => config.emojis.damage[x]).join(" ");
  const weak = enemy.weak.map((x) => config.emojis.damage[x]).join(" ");

  const title = enemy.getName() + ` (fighting ` + player.user.username + `)`;
  let description = `
*${enemy.description}*
        
Level: **\`${enemy.level}\`**

${config.emojis.health} **\`${enemy.health} / ${enemy.maxHP}\`**
${game.progressBar({ min: enemy.health, max: enemy.maxHP, type: "red" })}
`;

  // Show more information
  if (verbose) {
    description += `
Strengths: ${strong}
Weaknesses: ${weak}
    
**Attacks:**`;

    // Format attacks
    const attacks = await enemy.getAttacks(player);
    for (const attack of attacks) {
      const attackName = game.titleCase(attack.name);

      description += `\n\`${attackName}\` | `;

      // for (const damage of attack.damage.damages) {
      //   let damageText = `${damage.min}-${damage.max}`;
      //   if (damage.min == damage.max) damageText = `${damage.max}`;

      //   description += `**\`${damageText}\`**${emojis[damage.type]} `;
      // }
    }
  }

  const embed: Embed = {
    description: description,
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
