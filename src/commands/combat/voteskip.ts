import _ from "lodash";
import { game, prisma } from "../../tower.js";

export default {
  name: "voteskip",
  aliases: ["vs"],
  description: "Vote to skip a player's turn in a multiplayer encounter.",
  category: "combat",
  cooldown: "0",
  partyOnly: true,
  useInCombatOnly: true,
  useInDungeon: true,
  async execute(message, args, player, server) {
    // Check if party size is correct
    if (player.party.players.length <= 2)
      return game.error({
        player,
        content: `this command is only available in parties with at least 3 players.`,
      });
    // Check if the current entity is a player
    if (!player.encounter.currentPlayer)
      return game.error({
        player,
        content: `you can only vote to skip a player's turn.`,
      });
    // Check if player tries to skip their own turn
    if (player.encounter.currentPlayer == player.id)
      return game.error({
        player,
        content: `you can't vote to skip your own turn, silly.`,
      });
    // Get current encounter player
    const targetPlayer = await prisma.player.findUnique({
      where: { id: player.encounter.currentPlayer },
      include: { user: true },
    });
    // Get players that need to vote
    const otherPlayers = player.party.players.filter(
      (x) => x.id !== player.id && x.id !== targetPlayer.id
    );
    const otherPlayersPing = otherPlayers.map((x) => `<@${x.user.discordId}>`).join(" ");
    let agree = [];
    let total = otherPlayers.length;

    let menu = new game.Menu({
      player,
      boards: [{ name: "main", message: "main", rows: ["main"] }],
      rows: [
        {
          name: "main",
          type: "buttons",
          components: (m) => [
            {
              id: "agree",
              label: `Agree (${agree.length}/${total})`,
              style: "success",
              emoji: "👍",
              function(r, i, s) {
                agree = _.union(agree, [i.user.id]);
                m.refresh();
                if (agree.length >= total) {
                  skip();
                }
              },
            },
          ],
        },
      ],
      messages: [
        {
          name: "main",
          function: async () =>
            await game.send({
              player,
              send: false,
              reply: false,
              content: `${otherPlayersPing}, **${player.displayName}** wants to skip **${targetPlayer.user.username}'s** turn...`,
            }),
        },
      ],
    });

    menu.init("main", {
      filter: (i) =>
        player.party.players.some(
          (x) =>
            x.user.discordId == i.user.id &&
            i.user.id !== player.user.discordId &&
            i.user.id !== targetPlayer.user.discordId
        ),
    });
    // Activate emitter
    function skip() {
      game.emitter.emit("skipPlayer", { encounterId: player.encounterId });
    }
  },
} satisfies Command;
