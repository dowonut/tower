import { game, prisma } from "../../tower.js";

export default {
  name: "invite",
  aliases: ["in", "inv"],
  description: "Invite one or more players to your party.",
  category: "other",
  cooldown: "5",
  arguments: [
    { name: "player1", required: true, type: "user" },
    { name: "player2", required: false, type: "user" },
    { name: "player3", required: false, type: "user" },
  ],
  async execute(message, args, player, server) {
    let invitedPlayers: Player[] = [];

    // Iterate through invited players
    for (const [key, invitee] of Object.entries(args as Player[])) {
      if (!invitee) continue;
      // Check party size
      if (player.party && player.party.players.length >= 4)
        return game.error({
          message,
          content: `you can't have more than **4 players** in a party.`,
        });
      // Check if invitee is already in the party
      if (player.party && player.party.players.some((x) => x.id == invitee.id))
        return game.error({
          message,
          content: `<@${invitee.user.discordId}> is already in the party.`,
        });
      // Check if inviting self
      if (invitee.id == player.id)
        return game.error({
          message,
          content: `you can't invite yourself to a party...`,
        });
      // Check if invited the same person twice
      if (invitedPlayers.some((x) => x.id == invitee.id)) continue;
      invitedPlayers.push(invitee);

      // Create buttons
      const buttons: Button[] = [
        {
          id: "accept",
          label: "Join Party",
          emoji: "🤝",
          style: "success",
          function: (r) => {
            r.edit({
              components: [],
              content: `${invitee.ping} **accepted** the party request from ${player.ping}!`,
            });
            addToParty(invitee);
          },
        },
        {
          id: "deny",
          label: "Deny",
          style: "danger",
          function: (r) => {
            r.edit({
              components: [],
              content: `${invitee.ping} **denied** the party request from ${player.ping} :(`,
            });
          },
        },
      ];

      const row = game.actionRow("buttons", buttons);

      // Send invite message
      const botMsg = await game.send({
        message,
        components: [row],
        content: `<@${invitee.user.discordId}>, you've been invited to join <@${player.user.discordId}>'s party. **Accept?**`,
      });

      game.componentCollector(message, botMsg, buttons, undefined, {
        filter: (i) => i.user.id == invitee.user.discordId,
        max: 1,
      });
    }

    // Add invitee to the party
    async function addToParty(invitee: Player) {
      // Create a new party if none exists
      player = await player.refresh();
      invitee = await invitee.refresh();
      let party = player.party ? player.party : await createParty();

      // Check things again
      if (player.party && player.party.players.length >= 4)
        return game.error({
          message,
          content: `you can't have more than **4 players** in a party.`,
        });
      if (player.party && player.party.players.some((x) => x.id == invitee.id))
        return game.error({
          message,
          content: `<@${invitee.user.discordId}> is already in the party.`,
        });

      await prisma.party.update({
        where: { id: party.id },
        data: { players: { connect: [{ id: invitee.id }] } },
      });
      // Delete previous party if leaving
      if (invitee.party && invitee.party.players.length <= 2) {
        console.log("deleting old party");
        await prisma.party.delete({ where: { id: invitee.party.id } });
      }
    }

    // Create a new party
    async function createParty() {
      return await prisma.party.create({
        data: { leader: player.id, players: { connect: [{ id: player.id }] } },
      });
    }

    // Unlock new commands
    player.unlockCommands(message, [
      "party",
      "disbandparty",
      "leaveparty",
      "setpartyowner",
      "kick",
    ]);
  },
} satisfies Command;
