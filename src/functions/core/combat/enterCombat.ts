import { EnemyClass } from "../../../game/_classes/enemies.js";
import PlayerClass from "../../../game/_classes/players.js";
import { config, game, prisma } from "../../../tower.js";

/** Enter a combat encounter with an enemy. */
export default async function enterCombat(args: { player: Player; enemies: Enemy[] }) {
  let { enemies, player } = args;
  // Update player
  player = await player.refresh();

  // Check if already in combat
  if (player.encounter) {
    return game.error({ player, content: `You are already engaged in combat.` });
  }

  // Handle party
  let players: Player[] = [player];
  if (player.party) {
    // If not leader
    if (!player.isPartyLeader) {
      return game.error({
        player,
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
        channel: player.getChannel(),
      });
      // If player doesn't exist
      if (!invitee) {
        return game.error({
          player,
          content: `something went wrong trying to find <@${newPlayer.user.discordId}>`,
        });
      }
      // If player is already in combat
      if (invitee.inCombat) {
        return game.error({
          player,
          content: `can't start encounter because ${invitee.ping} is already in combat.`,
        });
      }
      // If player is on a different floor
      if (invitee.floor !== player.floor) {
        return game.error({
          player,
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
    const enemyData = await prisma.enemy.create({
      data: {
        name: enemy.name,
        health: enemy.maxHP,
        SG: config.baseSpeedGauge,
        number: enemyNumber,
      },
      include: { statusEffects: true },
    });
    enemies[i] = game.createClassObject(enemy, enemyData);
    enemyNumber++;
  }

  // Set starting SV for players
  for (const [i, player] of players.entries()) {
    const SG = config.baseSpeedGauge;
    players[i] = await player.update({ SG });
  }

  // Calculate initial turn order
  let turnOrder = game.getTurnOrder({ players, enemies });
  turnOrder = await game.updateTurnOrder(turnOrder);
  const firstPlayer: Player = game.getNextPlayer(turnOrder);

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
      currentPlayer: null,
    },
    include: { players: true, enemies: true },
  });

  // Update enemies and players
  enemies = turnOrder.filter((x) => x instanceof EnemyClass) as Enemy[];
  players = turnOrder.filter((x) => x instanceof PlayerClass) as Player[];

  // Handle encounter
  game.handleEncounter({ players, enemies, encounter, turnOrder, channel: player.channel });

  // Unlock new commands
  await player.unlockCommands(["attack", "flee", "enemyinfo", "status", "actioninfo"]);
}
