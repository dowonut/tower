import { config, game, prisma } from "../../../tower.js";

/** Enter a combat encounter with an enemy. */
export default async function enterCombat(args: { player: Player; enemies: Enemy[]; message: Message }) {
  const { player, message } = args;
  let { enemies } = args;

  // Handle party
  let players: Player[] = [player];
  if (player.party) {
    // If not leader
    if (!player.isPartyLeader) {
      return game.error({
        message,
        content: `only the party leader can initiate a combat encounter.`,
      });
    }

    // Get players from party
    for (const newPlayer of player.party.players) {
      // Check if leader
      if (newPlayer.id == player.id) continue;
      // Get player
      const invitee = await game.getPlayer({
        discordId: newPlayer.user.discordId,
        server: player.server,
      });
      // If player doesn't exist
      if (!invitee) {
        return game.error({
          message,
          content: `something went wrong trying to find <@${newPlayer.user.discordId}>`,
        });
      }
      // If player is already in combat
      if (invitee.inCombat) {
        return game.error({
          message,
          content: `can't start encounter because ${invitee.ping} is already in combat.`,
        });
      }
      // If player is on a different floor
      if (invitee.floor !== player.floor) {
        return game.error({
          message,
          content: `can't start encounter because ${invitee.ping} is on a different floor than the party leader.`,
        });
      }
      // Add player to list
      players.push(invitee);
    }
  }

  // Create enemies in database
  let enemyNumber = 1;
  for (const [i, enemy] of enemies.entries()) {
    const SV = enemy.baseSV;
    const enemyData = await prisma.enemy.create({
      data: {
        name: enemy.name,
        health: enemy.maxHP,
        SV,
        number: enemyNumber,
      },
    });
    enemies[i] = game.createClassObject(enemy, enemyData);
    enemyNumber++;
  }

  // Set starting SV for players
  for (const [i, player] of players.entries()) {
    const SV = player.baseSV;
    players[i] = await player.update({ SV });
  }

  // Calculate initial turn order
  let turnOrder = game.getTurnOrder({ players, enemies });
  turnOrder = await game.updateTurnOrder(turnOrder);
  const firstPlayer: Player = game.getNextPlayer(turnOrder);

  // console.log(
  //   turnOrder.map((x) => {
  //     return { id: x.id, SV: x.SV, isPlayer: x.isPlayer };
  //   })
  // );

  // Create new encounter
  const enemyIds = enemies.map((x) => {
    return { id: x.id };
  });
  const playerIds = players.map((x) => {
    return { id: x.id };
  });
  const encounter = await prisma.encounter.create({
    data: {
      enemies: { connect: enemyIds },
      players: { connect: playerIds },
      currentPlayer: firstPlayer.id,
    },
    include: { players: true, enemies: true },
  });

  // Handle encounter
  game.handleEncounter({ players, enemies, encounter, turnOrder, channel: message.channel });
}
