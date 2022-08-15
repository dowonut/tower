export default {
  name: "explore",
  description: "Explore your current floor.",
  aliases: ["e"],
  cooldown: "0",
  async execute(message, args, prisma, config, player, game, server, client) {
    // Get current region
    const region = player.getRegion();

    // Get players found merchants
    const foundMerchants = await player.getExplored("merchant");

    // Create possible outcomes
    let outcomes = [
      { name: "enemies", weight: 80 },
      { name: "loot", weight: 20 },
      { name: "merchants", weight: 20 },
    ];

    // If player has found all merchants
    if (region.merchants && foundMerchants.length >= region.merchants.length) {
      outcomes = [
        { name: "enemies", weight: 80 },
        { name: "loot", weight: 20 },
      ];
    }

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

    // Unlock region command
    player.unlockCommands(message, server, ["region"]);

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
          server,
          client
        );
        break;
      case "loot":
        // Give the player some random loot from that region
        await player.giveRandomLoot(message, server, game);
        // Unlock new commands
        player.unlockCommands(message, server, ["inventory"]);
        break;
      case "merchants":
        // Unlock a new random merchant from that region
        await player.unlockRandomMerchant(message, server, game);
        break;
    }
  },
};
