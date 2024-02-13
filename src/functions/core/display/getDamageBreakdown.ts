import emojis from "../../../emojis.js";
import { game } from "../../../tower.js";
import f from "./f.js";
import statEmoji from "./statEmoji.js";
import titleCase from "./titleCase.js";

/** Get a breakdown of a damage instance. */
export default function getDamageBreakdown(instance: EvaluatedDamage["instances"][number]) {
  const { details } = instance;
  if (!details) return "";
  const { damage, source, target } = details;

  let finalText = ``;

  // Base damage
  let baseDamage = ``;
  if (damage.scaling == "percent") {
    baseDamage = `**Base Damage:**\n${f(damage.basePercent + "%")} of ${statEmoji(
      damage.scalingStat
    )}${f(source[damage.scalingStat])} = ${f(details.baseDamage)}`;
  } else if (damage.scaling == "flat") {
    baseDamage = `Base Damage: ${f(details.baseDamage)}`;
  }
  finalText += `${baseDamage}\n`;

  // Crit damage
  if (instance.crit) {
    const critV = details.multipliers.critMultiplier;
    let critText = `${emojis.stats.CD} **Damage Multiplier:**\n${game.f(critV)} x ${game.f(
      details.baseDamage
    )} = ${f(Math.round(details.baseDamage * critV))}`;
    finalText += `${critText}\n`;
  }

  // Acute res modifier
  const targetRes = Math.round(details.targetResModifier * target[details.resStat]);
  if (instance.acute) {
    let acuteText = `${emojis.stats.AD} **Target RES Reduction:**\n${game.f(
      details.targetResModifier
    )} x ${statEmoji(details.resStat)}${f(target[details.resStat])} = ${statEmoji(
      details.resStat
    )}${f(targetRes)}`;
    finalText += `${acuteText}\n`;
  }

  // Resistance damage reduction
  let resistanceText = `${statEmoji(
    details.resStat
  )} **Damage Reduction:**\n\`(1-(${targetRes}/(${targetRes}+1000)))\` x ${f(
    Math.round(details.baseDamage * details.multipliers.critMultiplier)
  )} = ${f(details.roundedDamage)}`;
  finalText += `${resistanceText}\n`;

  // Final damage
  finalText += `**Total Damage:** ${emojis.damage[instance.type]}${f(details.roundedDamage)}`;

  return finalText;
}
