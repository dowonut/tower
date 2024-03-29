export default {
  description: (rawText, player, config) => {
    const textArray = rawText.split("\n");
    let description = ``;

    for (const item of textArray) {
      const lineArray = item.split(" ");

      if (!item) description += `\n`;
      else {
        let variable;
        let useName = false;
        let name;
        let useEmoji = false;
        let emoji;

        for (const item of lineArray) {
          if (item == "NAME") {
            useName = true;
          } else if (item == "EMOJI") {
            useEmoji = true;
          } else if (item == "XP") {
            variable = player.xp + " / " + config.nextLevelXp(player.level);
            name = "XP: ";
            emoji = config.emojis.xp;
          } else if (item == "HEALTH") {
            const healthWarning =
              (player.health / player.maxHealth) * 100 < 33 ? " :warning:" : "";
            variable = `\`${player.health} / ${player.maxHealth}\`${healthWarning}`;
            name = "Health: ";
            emoji = config.emojis.health;
          } else if (item == "MARKS") {
            variable = player.marks;
            name = "Marks: ";
            emoji = config.emojis.mark;
          } else if (item == "FLOOR") {
            variable =
              player.floor + " | " + game.titleCase(player.getRegion().name);
            name = "Floor: ";
            emoji = config.emojis.floor;
          } else if (item == "LEVEL") {
            variable = player.level;
            name = "Level: ";
          } else if (item == "STRENGTH") {
            variable = player.strength;
            name = "Strength: ";
            emoji = config.emojis.stats.strength;
          } else if (item == "DEFENCE") {
            variable = player.defence;
            name = "Defence: ";
            emoji = config.emojis.stats.defence;
          } else if (item == "ARCANE") {
            variable = player.arcane;
            name = "Arcane: ";
            emoji = config.emojis.stats.arcane;
          } else if (item == "VITALITY") {
            variable = player.vitality;
            name = "Vitality: ";
            emoji = config.emojis.stats.vitality;
          } else if (item == "PROGRESS") {
            variable = game.progressBar(
              player.xp,
              config.nextLevelXp(player.level)
            );
          } else if (item == "REGION") {
            variable = game.titleCase(player.getRegion().name);
            name = "Region: ";
            emoji = config.emojis.blank;
          }
        }
        let variableText = `\`${variable}\``;

        // if progress bar
        if (item == "PROGRESS") {
          variableText = variable;
        }
        if (item.split(" ").includes("HEALTH")) {
          variableText = variable;
        }

        if (useName && useEmoji) {
          description += emoji + " " + name + variableText;
        } else if (useName) {
          description += name + variableText;
        } else if (useEmoji) {
          description += emoji + " " + variableText;
        } else {
          description += variableText;
        }

        description += `\n`;
      }
    }

    return description;
  },
};
