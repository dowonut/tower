import { game, prisma } from "../../tower.js";

export default {
  name: "enterdungeon",
  aliases: ["ed"],
  description: "Enter a dungeon.",
  category: "dungeon",
  cooldown: "10",
  unlockCommands: ["leavedungeon"],
  arguments: [{ required: true, name: "dungeon", type: "playerAvailableDungeon" }],
  async execute(message, args: { dungeon: string }, player, server) {
    const { dungeon: dungeonName } = args;

    // Check if player is already inside of a dungeon
    if (player.dungeon) {
      return game.error({ player, content: `you are already in a dungeon.` });
    }

    // Check if player is party leader
    if (player.party && !player.isPartyLeader) {
      return game.error({ player, content: `only the party leader can enter a dungeon.` });
    }

    // Format list of players to attach to dungeon
    let players = [{ id: player.id }];
    if (player.party) {
      players = player.party.players.map((x) => ({ id: x.id }));
    }

    // Create dungeon in database
    await prisma.dungeon.create({
      data: { name: dungeonName, players: { connect: players } },
    });

    // Fetch dungeon and generate structure
    const dungeon = await player.getDungeon();
    await dungeon.generateStructure();

    // Handle dungeon
    let finalPlayers: Player[] = [player];
    if (player.party) {
      finalPlayers = [];
      for (const partyMember of player.party.players) {
        finalPlayers.push(
          await game.getPlayer({
            discordId: partyMember.user.discordId,
            server: player.server,
            channel: player.channel,
          })
        );
      }
    }
    await game.handleDungeon({
      dungeon,
      players: finalPlayers,
      leader: finalPlayers.find((x) => x.id == player.id),
    });
  },
} satisfies Command;
