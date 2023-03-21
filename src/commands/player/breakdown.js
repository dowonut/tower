import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "breakdown",
  aliases: ["br", "bd"],
  arguments: "",
  description: "See a detailed breakdown of all your player stats.",
  category: "player",
  useInCombat: true,
  async execute(message, args, player, server) {
    const input = args.join(" ").toLowerCase();
    let description = ``;
    const bullet = config.emojis.bullet;
    const damageEmojis = config.emojis.damage;
    const blank = config.emojis.blank;

    // Get player strength
    const strength = player.strength;

    // Get player defence
    const defence = player.defence;

    // Get player passive modifiers
    const passives = await player.getPassives("damage");

    // Get equipped weapon
    const weapon = await player.getEquipped("hand");

    let weaponValue = 0;
    let weaponEmoji = ``;
    let skillText = ``;
    let potionText = ``;
    let skillValue = 0;
    let potionValue = 0;

    // Get weapon bonus
    if (weapon) {
      weaponValue = weapon.damage;
      weaponEmoji = damageEmojis[weapon.damageType];
    }

    // Iterate through modifiers
    for (const passive of passives) {
      const valueText = `\n + \`${passive.value}%\` `;
      const passiveName = game.titleCase(passive.name);
      const duration = passive.duration
        ? ` | \`${passive.duration} rounds remaining\``
        : ``;

      // Add skill text
      if (passive.source == "skill") {
        skillText += valueText;
        skillText += `${passiveName} Skill Bonus `;
        skillValue += passive.value;
      }
      // Add potion text
      else if (passive.source == "potion") {
        potionText += valueText;
        potionText += `Potion Bonus `;
        potionText += `${config.emojis.items.potion}`;
        potionText += `${duration}`;
        potionValue += passive.value;
      }
    }

    const skillMult = game.sliceNumber(skillValue / 100 + 1);
    const strengthMult = game.sliceNumber(strength / 100 + 1);
    const potionMult = game.sliceNumber(potionValue / 100 + 1);
    const totalDmgMult = game.sliceNumber(
      Math.round(skillMult * strengthMult * potionMult * 10) / 10
    );

    // If no input provided list all
    if (!input) {
      description = await formatDescription({ attack: undefined });

      var title = `Stat Breakdown`;
      var embed = { description: description };
    }
    // If input provided show specific attack
    else {
      const attack = await player.getAttack(input);
      if (!attack) return game.error({ message, content: "invalid attack." });

      description = await formatDescription({ attack: attack });

      var title = `${attack.getName()} Attack Breakdown`;
      var embed = { description: description };
    }

    if (title && embed) return game.fastEmbed(message, player, embed, title);

    async function formatDescription(obj) {
      if (obj.attack) {
        const attack = obj.attack;
        let { damages } = await attack.baseDamage();

        var baseDamage = getDamageText(damages, damageEmojis);
        var weaponDamage = getDamageText(damages, damageEmojis, {
          bonus: weaponValue,
        });
        var skillDamage = getDamageText(damages, damageEmojis, {
          mult: skillMult,
        });
        var strengthDamage = getDamageText(damages, damageEmojis, {
          mult: strengthMult,
        });
        var totalDamage = getDamageText(damages, damageEmojis, {
          mult: potionMult,
        });
      }

      if (obj.attack)
        description += `\n${bullet} **Base Damage:** ${baseDamage}`;

      // Add weapon bonus to description
      if (weaponValue > 0) {
        description += `\n\n+ \`${weaponValue}\`${weaponEmoji} Weapon Bonus ${weapon.getEmoji()}`;
        description += `\n└ **Weapon Bonus:** \`+${weaponValue}\`${weaponEmoji}`;
        if (obj.attack) description += `\n${blank}└ ${weaponDamage}`;
      }
      // Add skills to description
      if (skillValue > 0) {
        description += `\n${skillText}`;
        description += `\n└ **Skill Multiplier:** \`x${skillMult}\``;
        if (obj.attack) description += `\n${blank}└ ${skillDamage}`;
      }
      // Add strength to description
      if (strength > 0) {
        description += `\n\n+ \`${strength}%\` Strength Bonus ${config.emojis.stats.strength}`;
        description += `\n└ **Strength Multiplier:** \`x${strengthMult}\``;
        if (obj.attack) description += `\n${blank}└ ${strengthDamage}`;
      }
      // Add potions to description
      if (potionValue > 0) {
        description += `\n${potionText}`;
        description += `\n└ **Potion Multiplier:** \`x${potionMult}\``;
        if (obj.attack) description += `\n${blank}└ ${totalDamage}`;
      }
      // Add total damage

      if (obj.attack)
        description += `\n\n${bullet} **Total Damage:** ${totalDamage}`;
      else {
        description += `\n\n${bullet} **Total Damage Bonus:** \`+${weaponValue}\``;
        description += `\n\n${bullet} **Total Damage Multiplier:** \`x${totalDmgMult}\``;
      }
      return description;
    }
  },
};

function getDamageText(damages, emojis, obj) {
  const bonus = obj && obj.bonus ? obj.bonus : 0;
  const mult = obj && obj.mult ? obj.mult : 1;

  let text = [];
  for (let damage of damages) {
    damage.min = (damage.min + bonus) * mult;
    damage.max = (damage.max + bonus) * mult;

    text.push(
      `\`${Math.floor(damage.min)}-${Math.floor(damage.max)}\`${
        emojis[damage.type]
      }`
    );
  }

  return text.join(" ");
}
