import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "flee",
  aliases: ["fl"],
  description: "Attempt to flee from the enemy you're fighting.",
  category: "combat",
  useInCombatOnly: true,
  useInTurnOnly: true,
  cooldownGroup: "combat_action",
  useInDungeon: true,
  async execute(message, args, player, server) {
    // Notify encounter of player action
    game.emitPlayerAction({ player });

    if (player.party && !player.isPartyLeader)
      return game.error({
        player,
        content: `only the party leader can decide to flee from an encounter.`,
      });

    // Flee from encounter
    game.emitter.emit("flee", {
      encounterId: player.encounterId,
      player,
    } satisfies PlayerFleeEmitter);

    // const response = await player.exitCombat();

    // if (response !== "success") return;

    // let content = `You ran away!`;
    // if (player.party) content = `You ran away and took the party with you!`;

    // const botMessage = await game.send({
    //   player,
    //   content,
    //   reply: true,
    // });

    // // Add explore button
    // game.commandButton({
    //   player,
    //   botMessage,
    //   commands: [{ name: "explore" }],
    // });

    // return "success";
  },
} as Command;
