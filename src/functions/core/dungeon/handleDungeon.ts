import { game } from "../../../tower.js";

/** Handle a dungeon instance. */
export default async function handleDungeon(args: {
  dungeon: Dungeon;
  players: Player[];
  leader: Player;
}) {
  const { dungeon, players, leader } = args;

  // Update all players
  for (const player of players) {
    player.update({ environment: "dungeon" });
  }

  const image = await game.createDungeonImage({ dungeon });

  game.fastEmbed({
    files: [image],
    player: leader,
    embed: { image: { url: "attachment://dungeon.png" } },
  });
}
