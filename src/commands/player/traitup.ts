import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "traitup",
  aliases: ["tu"],
  arguments: [
    {
      name: "trait",
      required: true,
      filter: (i: PlayerTrait) => {
        if (config.traits.includes(i)) {
          return { success: true, content: i };
        } else {
          return { success: false, message: `\`${i}\` is not a valid trait.` };
        }
      },
    },
    {
      name: "amount",
      required: false,
      type: "number",
    },
  ],
  description: "Level up a stat using stat points.",
  category: "player",
  async execute(message, args: { trait: PlayerTrait; amount: number | "all" }, player, server) {
    let { trait, amount } = args;

    // Set quantity to all
    if (amount == "all") amount = player.traitPoints;

    // Check if has quantity
    if (amount > player.traitPoints)
      return game.error({
        player,
        content: "you don't have enough trait points to do that.",
      });

    // Update player info
    player = await player.update({
      traitPoints: { increment: -amount },
      [trait]: { increment: amount },
    });

    const traitName = game.titleCase(trait);

    // Send trait up message
    game.send({
      player,
      reply: true,
      content: `Increased ${config.emojis.traits[trait]} **${traitName}** to ${game.f(player[trait])}`,
    });

    // Unlock breakdown command
    player.unlockCommands(["breakdown"]);
  },
} satisfies Command;
