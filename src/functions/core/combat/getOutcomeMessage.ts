import emojis from "../../../emojis.js";
import { EnemyClass } from "../../../game/_classes/enemies.js";
import PlayerClass from "../../../game/_classes/players.js";
import { game, config } from "../../../tower.js";

/** Get message for an action or status effect outcome. */
export default function getOutcomeMessage(args: {
  source: Player | Enemy;
  target: Player | Enemy;
  damage?: EvaluatedDamage;
  outcome: ActionOutcome | StatusEffectOutcome;
  previousHealth?: number;
}) {
  const {
    source,
    target,
    damage = { instances: [], total: 0 },
    previousHealth = 0,
    outcome,
  } = args;

  let healthText: string;
  let healthBar: string;
  let sourceName: string;
  let targetName: string;
  let statusName: string;
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
  // Define status effect name
  if (outcome.type == "apply_status") {
    statusName = game.titleCase(outcome.status.name);
  }

  // Format action message
  let actionMessage = game.getRandom(outcome.messages);

  // Define damage text
  const damageText = damage.instances
    .map((x) => {
      const critEmoji = x.crit ? emojis.stats.CD : "";
      const acuteEmoji = x.acute ? emojis.stats.AD : "";
      return `${critEmoji}${acuteEmoji}${emojis.damage[x.type]}${game.f(x.total)}`;
    })
    .join(", ");

  actionMessage = actionMessage.replaceAll(/TARGET|HOST/g, `**${targetName}**`);
  actionMessage = actionMessage.replaceAll("DAMAGE", damageText + " damage");
  actionMessage = actionMessage.replaceAll("SOURCE", `**${sourceName}**`);
  actionMessage = actionMessage.replaceAll("STATUS", `**${statusName}**`);

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
  let message = ``;
  if (damage.total > 0) {
    message = `\n${healthText}\n${healthBar}\n${actionMessage}\n${separatorLine}`;
  } else {
    message = `\n${actionMessage}\n${separatorLine}`;
  }

  return message;
}
