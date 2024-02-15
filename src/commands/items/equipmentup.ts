import emojis from "../../emojis.js";
import { config, game } from "../../tower.js";

export default {
  name: "equipmentup",
  aliases: ["equ", "eu", "equipup", "levelequipment", "levelequip", "equp"],
  description: "Level up your equipment using essence.",
  category: "item",
  arguments: [
    {
      name: "item",
      type: "playerOwnedItem",
    },
    {
      name: "fragile_essence",
      type: "numberZero",
    },
    {
      name: "ordinary_essence",
      type: "numberZero",
      required: false,
    },
    {
      name: "potent_essence",
      type: "numberZero",
      required: false,
    },
  ],
  async execute(
    message,
    args: {
      item: Item;
      fragile_essence: number | "all";
      ordinary_essence: number | "all";
      potent_essence: number | "all";
    },
    player,
    server
  ) {
    const { item, fragile_essence, ordinary_essence = 0, potent_essence = 0 } = args;

    // Check if valid item
    if (item.category !== "armor" && item.category !== "weapon") {
      return game.error({ player, content: `this item can't be leveled up.` });
    }

    const essanceNames = ["frail essence", "ordinary essence", "potent essence"];
    let essences = {
      "frail essence": 0,
      "ordinary essence": 0,
      "potent essence": 0,
    };

    // Gather essences
    for (const [i, x] of [fragile_essence, ordinary_essence, potent_essence].entries()) {
      if (x == "all" || x > 0) {
        const essence = await player.getItem(essanceNames[i]);

        if (!essence || essence.quantity < 1) {
          return game.error({
            player,
            content: `you don't have any **${game.titleCase(
              essanceNames[i]
            )}** in your inventory.\nEssence can be collected by killing enemies.`,
          });
        }

        if (x == "all") {
          essences[essanceNames[i]] = essence.quantity;
        } else {
          essences[essanceNames[i]] = Math.min(essence.quantity, x);
        }
      }
    }

    // Calculate total xp and format text
    const previousStats = item.getStats();
    let totalXp = 0;
    let essenceText: string[] = [];
    Object.entries(essences).forEach(async ([key, value]) => {
      if (value < 1) return;
      const essence = game.getItem(key);
      totalXp += essence.xpMaterial.amount * value;
      essenceText.push(`${game.f(`${value}x`)} **${essence.getName()}** ${essence.getEmoji()}`);
      await player.giveItem(key, -value);
    });

    // Check if player has any essence
    if (totalXp < 1) {
      return game.error({
        player,
        content: `you haven't provided any essences.`,
      });
    }

    let xp = totalXp;
    let levelUp = 0;
    let nextLevelXp = config.weapon_nextLevelXp(item.level);
    await item.update({ xp: { increment: xp } });

    // Once level up reached
    for (let i = 0; item.xp >= nextLevelXp; i++) {
      // Calculate remaining xp
      let newXp = item.xp - nextLevelXp;

      // Update player data
      await item.update({
        xp: newXp,
        level: { increment: 1 },
      });

      // Get required xp for next level
      nextLevelXp = config.weapon_nextLevelXp(item.level);
      levelUp++;
    }

    // Send XP message
    await game.send({
      player,
      reply: true,
      content: `Used ${essenceText.join(
        ", "
      )} to imbue **${item.getName()}** ${item.getEmoji()} with ${game.f(
        totalXp + " XP"
      )} (${game.f(config.weapon_nextLevelXp(item.level) - totalXp)} until next level)`,
    });

    // Send level up message
    if (levelUp > 0) {
      const { green_arrow, green_side_arrow } = config.emojis;
      let description = `
### ${green_arrow} ${item.getName()} Level Up! ${green_arrow}
New Level: **\`${item.level}\`**
${game.fastProgressBar("xp", item)}
  `;
      for (const [stat, value] of Object.entries(previousStats) as [WeaponStat, number][]) {
        let name: string = stat;
        name = game.titleCase(name);
        const newStat = item.getStat(stat);
        if (newStat == value) continue;
        description += `\n${config.emojis.stats[stat]} \`${value} ${name}\` ${green_side_arrow} **\`${newStat} ${name}\`**`;
      }
      const image = item.getImage();

      await game.fastEmbed({
        player,
        description,
        color: "green",
        reply: true,
        files: [image],
        thumbnail: "attachment://item.png",
      });
    }
  },
} satisfies Command;
