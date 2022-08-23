export default {
  name: "breakdown",
  aliases: ["br", "bd"],
  arguments: "",
  description: "See a detailed breakdown of all your player stats.",
  category: "Player",
  useInCombat: true,
  async execute(message, args, prisma, config, player, game, server) {
    const input = args.join(" ").toLowerCase();
    let description = ``;
    const bullet = config.emojis.bullet;
    const damage = config.emojis.damage;

    // Get player strength
    const strength = player.strength;

    // Get player defence
    const defence = player.defence;

    // Get player passive modifiers
    const passives = await player.getPassives("DAMAGE");

    // If no input provided list all
    if (!input) {
      // Damage title
      // description += `\n${bullet} **Damage**`;

      // Get equipped weapon
      const weapon = await player.getEquipped("hand");

      // Get weapon bonus
      if (weapon) {
        const weaponDamage = weapon.damage;
        const emoji = damage[weapon.damageType];

        description += `\n\n+ \`${weaponDamage}\`${emoji} Weapon Bonus`;
        description += `\n**Total Damage Bonus:** \`+${weapon.damage}\`${emoji}`;
      }

      // Add strength to description
      description += `\n\n+ \`${strength}%\` Strength Bonus ${config.emojis.stats.strength}`;

      // Iterate through passive modifiers
      let passiveValue = 0;
      for (const passive of passives) {
        passiveValue += passive.value;
        const passiveName = game.titleCase(passive.name);
        // Add passive modifier to description
        description += `\n+ \`${passive.value}%\` `;
        if (passive.source == "potion") {
          description += `Potion Bonus`;
          description += ` ${config.emojis.items.potion}`;
        } else if (passive.source == "skill") {
          description += `${passiveName} Skill Bonus`;
        }
        if (passive.duration) {
          description += ` | \`${passive.duration} rounds remaining\``;
        }
      }
      const totalDmgMult = ((strength + passiveValue) / 100 + 1)
        .toString()
        .slice(0, 4);

      // Total damage multiplier
      description += `\n**Total Damage Multiplier:** \`x${totalDmgMult}\``;

      // // Defence title
      // description += `\n\n${bullet} **Defence**`;

      // // Add defence to description
      // description += `\n\n\`+${defence}%\` Defence Bonus`;

      // // Total defence multiplier
      // const totalDefMult = (defence / 100 + 1).toString().slice(0, 4);
      // description += `\n**Total Defence Multiplier:** \`x${totalDefMult}\``;

      var title = `Stat Breakdown`;
      var embed = { description: description };
    }
    // If input provided show specific attack
    else {
      const attack = await player.getAttack(input);
      if (!attack) return game.error(message, "invalid attack.");

      const baseDamage = await attack.baseDamage();
      const damageBonus = await attack.damageBonus(player);
      const damageMultiplier = await attack.damageMultiplier(player);

      console.log(baseDamage, damageBonus, damageMultiplier);
    }

    if (title && embed) return game.fastEmbed(message, player, embed, title);
  },
};
