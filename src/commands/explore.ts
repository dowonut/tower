import { game, config, client, prisma } from "../tower.js";

export default {
  name: "explore",
  description: "Explore your current floor.",
  aliases: ["e"],
  cooldown: "5",
  async execute(message, args, player, server) {
    // Get current region
    const region = player.getRegion();

    // Get players found merchants
    const foundMerchants = await player.getExploration("merchant");

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

    // // Unlock region command
    player.unlockCommands(["region"]);

    // Log output
    switch (item) {
      case "enemies":
        // Start random enemy encounter in region
        await game.enemyEncounter({ player });
        break;
      case "loot":
        // Give the player some random loot from that region
        const botMessage = await player.giveRandomLoot();
        // Unlock new commands
        player.unlockCommands(["inventory"]);
        // Add an explore button
        game.commandButton({
          player,
          botMessage,
          commands: [{ name: "explore" }],
        });
        break;
      case "merchants":
        // Unlock a new random merchant from that region
        await player.unlockRandomMerchant();
        break;
    }
  },
} as Command;
