import { game, config } from "../../tower.js";
import { f, titleCase } from "../core/index.js";

/** Give XP and handle leveling. */
export default (async function (args: { amount: number; message: Message }) {
  const { amount, message } = args;

  // Add xp to player
  let player = await this.update({ xp: { increment: amount } });

  // Calculate xp required for next level
  let nextLevelXp = config.nextLevelXp(player.level);
  let levelUp = 0;
  const previousStats = player.getBaseStats();

  // Once level up reached
  for (let i = 0; player.xp >= nextLevelXp; i++) {
    // Calculate remaining xp
    let newXp = player.xp - nextLevelXp;

    // Update player data
    player = await this.update({
      xp: newXp,
      level: { increment: 1 },
      traitPoints: { increment: 1 },
    });

    // Get required xp for next level
    nextLevelXp = config.nextLevelXp(player.level);
    levelUp++;
  }

  // Update health to new max
  await player.update({ health: player.maxHP });

  // Unlock new commands
  this.unlockCommands(message, ["traits", "traitup", "floor", "region", "breakdown", "leaderboard"]);

  if (levelUp > 0) {
    const { gold_arrow, green_side_arrow } = config.emojis;
    let description = `
# ${gold_arrow} Level Up! ${gold_arrow}
New level: ${f(player.level)}
New trait points: ${f(levelUp)}
`;
    for (const [stat, value] of Object.entries(previousStats) as [PlayerStat, number][]) {
      let name: string = stat;
      if (stat == "maxHP") name = "HP";
      name = titleCase(name);
      const newStat = player.getBaseStat(stat);
      if (newStat == value) continue;
      description += `\n\`${value} ${name}\` ${green_side_arrow} **\`${newStat} ${name}\`**`;
    }

    await game.fastEmbed({ message, player, description, color: "gold", reply: true });
  }
} satisfies PlayerFunction);
