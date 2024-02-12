import _ from "lodash";
import { game } from "../../tower.js";

export default {
  name: "move",
  aliases: ["mv", "mo"],
  description: "Move while inside of a dungeon",
  category: "dungeon",
  environment: ["dungeon"],
  arguments: [
    {
      name: "direction",
      required: true,
      filter: (i) => {
        let direction: string;
        if (i == "up" || i == "u") {
          direction = "up";
        } else if (i == "down" || i == "d") {
          direction = "down";
        } else if (i == "left" || i == "l") {
          direction = "left";
        } else if (i == "right" || i == "r") {
          direction = "right";
        }

        if (!direction) {
          return {
            success: false,
            message:
              "not a valid direction.\nValid directions include: `up`, `down`, `left`, and `right`",
          };
        } else {
          return {
            success: true,
            content: direction,
          };
        }
      },
    },
  ],
  async execute(message, args: { direction: "up" | "down" | "left" | "right" }, player, server) {
    const { direction } = args;

    // Check if player is party leader
    if (player.party && !player.isPartyLeader) {
      return game.error({ player, content: `only the party leader can move inside a dungeon.` });
    }

    // Get dungeon
    const dungeon = await player.getDungeon();

    // Check if valid direction
    const newChamber = dungeon.getRelativeChamber(direction, dungeon.x, dungeon.y);
    if (!newChamber) {
      return game.error({
        player,
        content: `not a valid direction. Look at the dungeon map to see which way you can go.`,
      });
    }

    // Update with new coords and new discovered tiles
    const newCoords = dungeon.getRelativeCoords(direction, dungeon.x, dungeon.y);
    let discoveredTiles = dungeon.discoveredTiles;
    discoveredTiles.push(...dungeon.getAdjacentChambers(newCoords.x, newCoords.y));
    await dungeon.update({
      x: newCoords.x,
      y: newCoords.y,
      discoveredTiles: _.uniq(discoveredTiles),
    });

    // Send emitter
    game.emitter.emit("playerMoveInDungeon", {
      dungeon,
    } satisfies DungeonMoveEmitter);
  },
} satisfies Command;
