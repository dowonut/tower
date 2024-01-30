import emojis from "../../../emojis.js";
import { EnemyClass } from "../../../game/_classes/enemies.js";
import PlayerClass from "../../../game/_classes/players.js";
import { game, config } from "../../../tower.js";

/** Get an attack message. */
export default function getEffectMessage(args: {
  source: Player | Enemy;
  target: Player | Enemy;
  damage?: EvaluatedDamage;
  effect: ActionEffect;
  previousHealth?: number;
}) {
  const { source, target, damage = { instances: [], total: 0 }, previousHealth = 0, effect } = args;

  let healthText: string;
  let healthBar: string;
  let sourceName: string;
  let targetName: string;
  let barColor: ProgressBarColor;
  // Define source and target names
  if (source instanceof PlayerClass) {
    sourceName = source.ping;
  } else if (source instanceof EnemyClass) {
    sourceName = source.displayName;
  }
  if (target instanceof PlayerClass) {
    barColor = "green";
    targetName = target.ping;
  } else if (target instanceof EnemyClass) {
    barColor = "red";
    targetName = target.displayName;
  }

  // Format action message
  let actionMessage = game.getRandom(effect.messages);

  const damageText = damage.instances
    .map((x) => `${emojis.damage[x.type]}${game.f(x.total)}`)
    .join(", ");

  actionMessage = actionMessage.replaceAll("TARGET", `**${targetName}**`);
  actionMessage = actionMessage.replaceAll("DAMAGE", damageText + " damage");
  actionMessage = actionMessage.replaceAll("SOURCE", `**${sourceName}**`);

  healthText =
    `**${targetName}** | ${config.emojis.health} ` + game.f(`${target.health} / ${target.maxHP}`);
  healthBar = game.progressBar({
    type: barColor,
    min: target.health,
    max: target.maxHP,
    minPrevious: previousHealth,
    count: 16,
  });

  const separatorLine = ""; //emojis.line.repeat(16);
  const finalMessage = `_ _\n${healthText}\n${healthBar}\n${actionMessage}\n${separatorLine}`;
  return finalMessage;
}
