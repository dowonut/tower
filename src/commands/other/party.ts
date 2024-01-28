import { config, game } from "../../tower.js";

export default {
  name: "party",
  aliases: ["pa"],
  description: "Check your current party.",
  category: "other",
  useInCombat: true,
  async execute(message, args, player, server) {
    if (!player.party)
      return game.error({
        player,
        content: `you're not in a party. Create a party by inviting someone with \`${server.prefix}invite <player>\``,
      });
    const partyId = player.party.id;

    const menu = new game.Menu({
      player,
      boards: [{ name: "list", rows: ["options"], message: "list" }],
      rows: [
        {
          name: "options",
          type: "buttons",
          components: async (m) => {
            return [
              {
                id: "invite_player",
                label: "Invite Player",
                emoji: "✉️",
                disable:
                  m.player.isPartyLeader && m.player.party.players.length < 4 && !m.player.inCombat ? false : true,
                style: "primary",
                modal: {
                  id: "player",
                  title: "Invite Player",
                  components: [
                    {
                      id: "player_name",
                      label: "Player Username",
                      style: "short",
                    },
                  ],
                  function: async (r, i) => {
                    const playerName = r[0].value;
                    await game.runCommand("invite", {
                      discordId: i.user.id,
                      message: m.botMessage,
                      server,
                      args: [playerName],
                    });
                    m.refresh();
                  },
                },
              },
              {
                id: "disband",
                label: "Disband",
                disable: m.player.isPartyLeader && !m.player.inCombat ? false : true,
                function: async (r, i) => {
                  const response = await game.runCommand("disbandparty", {
                    discordId: i.user.id,
                    message: m.botMessage,
                    server,
                    args: [],
                  });
                  if (response == "cancel") return;
                  if (response == "disband") m.botMessage.delete();
                },
              },
              {
                id: "leave",
                label: "Leave",
                disable: m.player.inCombat,
                function: async (r, i) => {
                  const response = await game.runCommand("leaveparty", {
                    discordId: i.user.id,
                    message: m.botMessage,
                    server,
                    args: [],
                  });
                  if (response == "left") m.refresh();
                  if (response == "deleted") m.botMessage.delete();
                },
              },
            ];
          },
        },
      ],
      messages: [
        {
          name: "list",
          function: async (m) => {
            const party = await game.getParty(partyId);
            const image = await m.player.createPartyImage();
            let description = ``;
            for (let i = 0; i < party.players.length; i++) {
              const player = await game.getPlayer({
                discordId: party.players[i].user.discordId,
                server,
                channel: m.player.getChannel(),
              });
              let emoji = ``;
              if (party.leader == player.id) emoji = "👑";
              let healthText = `${config.emojis.health} \`${player.health}/${player.maxHP}\``;
              let progressBar = game.progressBar({
                min: player.health,
                max: player.maxHP,
                type: "red",
                count: 10,
              });
              description += `${emoji} <@${player.user.discordId}> | ${healthText}\n${progressBar}\n`;
            }
            return await game.fastEmbed({
              fullSend: false,
              reply: true,
              player: m.player,
              description,
              title: `Party (\`${party.players.length}/4\`)`,
              files: [image],
              embed: { image: { url: "attachment://party.png" } },
            });
          },
        },
      ],
    });

    menu.init("list", {
      filter: (i) => {
        return player.party.players.some((x) => x.user.discordId == i.user.id);
      },
    });
  },
} satisfies Command;
