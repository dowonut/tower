export default {
  name: "explore",
  description: "Explore your current floor.",
  aliases: ["e"],
  cooldown: "2",
  async execute(message, args, prisma, config, player, game, server) {
    // Get current region
    const region = player.getRegion();

    // Create possible outcomes
    const outcomes = [
      { name: "enemies", weight: 80 },
      { name: "loot", weight: 20 },
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

    console.log("Exploring outcomes:");
    console.log("Options:", options, "Weights:", weights);
    console.log("Outcome:", item);
    console.log("----------------------------");

    // Log output
    switch (item) {
      case "enemies":
        // Start random enemy encounter in region
        await game.startEnemyEncounter(
          message,
          prisma,
          config,
          player,
          game,
          server
        );
        break;
      case "loot":
        // Give the player some random loot from that region
        await player.giveRandomLoot(message, game);
        // Unlock new commands
        player.unlockCommands(message, server, ["inventory"]);
        break;
      case "merchants":
        // Unlock a new random merchant from that region
        return console.log("find merchant");
        await player.unlockRandomMerchant();
        break;
    }
  },
};
