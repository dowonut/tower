import { game, config } from "../../tower.js";

/** Give XP and handle leveling. */
export default (async function (args: {
  amount: number;
  message: Message;
  server: Server;
}) {
  const { amount, message, server } = args;

  // Add xp to player
  let player = await this.update({ xp: { increment: amount } });

  // Calculate xp required for next level
  let nextLevelXp = config.nextLevelXp(player.level);
  let levelUp = 0;

  // Once level up reached
  for (let i = 0; player.xp >= nextLevelXp; i++) {
    // Calculate remaining xp
    let newXp = player.xp - nextLevelXp;

    // Update player data
    player = await this.update({
      xp: newXp,
      level: { increment: 1 },
      statpoints: { increment: 1 },
    });

    // Get required xp for next level
    nextLevelXp = config.nextLevelXp(player.level);
    levelUp++;
  }

  // Unlock new commands
  this.unlockCommands(message, [
    "stats",
    "statup",
    "floor",
    "region",
    "breakdown",
    "leaderboard",
  ]);

  if (levelUp > 0) {
    return await game.send({
      message,
      reply: true,
      content: `**Level Up!**
    
    :tada: You are now level \`${player.level}\`
    :low_brightness: You have \`${levelUp}\` new stat points`,
    });
  } else return;
} satisfies PlayerFunction);
