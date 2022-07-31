export default {
  name: "explore",
  description: "Explore your current floor.",
  aliases: ["e"],
  async execute(message, args, prisma, config, player, game, server) {
    // await game.startEnemyEncounter(
    //   message,
    //   args,
    //   prisma,
    //   config,
    //   player,
    //   game,
    //   server
    // );

    // Get current region
    const region = player.getRegion();

    // Create possible outcomes
    const outcomes = [
      { name: "enemies", weight: 70 },
      { name: "loot", weight: 30 },
      { name: "merchants", weight: 10 },
    ];

    // Map outcomenames
    const outcomeNames = outcomes.map((outcome) => outcome.name);

    // Create options and weights
    let options = [];
    let weights = [];

    // Check which outcomes are available in current region
    for (const [key] of Object.entries(region)) {
      if (outcomeNames.includes(key)) {
        options.push(key);
        weights.push(outcomes.find((x) => x.name == key).weight);
      }
    }

    // Get random output from weights
    let { item } = game.weightedRandom(options, weights);

    // Log output
    switch (item) {
      case "enemies":
        await game.startEnemyEncounter(
          message,
          args,
          prisma,
          config,
          player,
          game,
          server
        );
        break;
      case "loot":
        return console.log("give loot");
        await player.giveRandomLoot();
        break;
      case "merchants":
        return console.log("find merchant");
        await player.unlockRandomMerchant();
        break;
    }
  },
};
