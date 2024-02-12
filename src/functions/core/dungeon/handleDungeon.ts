import emojis from "../../../emojis.js";
import { game } from "../../../tower.js";

/** Handle a dungeon instance. */
export default async function handleDungeon(args: {
  dungeon: Dungeon;
  players: Player[];
  leader: Player;
}) {
  let { dungeon, players, leader } = args;

  // Update all players
  for (const player of players) {
    player.update({ environment: "dungeon" });
  }

  //* Create main dungeon menu
  const menu = new game.Menu({
    player: leader,
    // Save message information to database
    onLoad: async (m) => {
      await dungeon.update({
        discordMessageId: menu.botMessage?.id,
        discordChannelId: menu.botMessage?.channelId,
      });
    },
  });

  //* Messages
  menu.setMessages([
    {
      name: "main",
      function: async (m) => {
        const title = dungeon.getName();

        const image = await game.createDungeonImage({ dungeon });

        return game.fastEmbed({
          fullSend: false,
          files: [image],
          player: leader,
          title,
          embed: { image: { url: "attachment://dungeon.png" } },
        });
      },
    },
  ]);

  //* Rows
  menu.setRows([
    // First row of movement buttons
    {
      name: "movement1",
      type: "buttons",
      components: (m) => [
        { id: "blank1", disable: true, emoji: emojis.blank },
        {
          id: "up",
          emoji: emojis.up,
          style: "primary",
          disable: dungeon.getRelativeChamber("up", dungeon.x, dungeon.y) == undefined,
          function: async () => {
            await runCommand("move", ["up"]);
          },
        },
        { id: "blank2", disable: true, emoji: emojis.blank },
      ],
    },
    // Second row of movement buttons
    {
      name: "movement2",
      type: "buttons",
      components: (m) => [
        {
          id: "left",
          emoji: emojis.left,
          style: "primary",
          disable: dungeon.getRelativeChamber("left", dungeon.x, dungeon.y) == undefined,
          function: async () => {
            await runCommand("move", ["left"]);
          },
        },
        {
          id: "down",
          emoji: emojis.down,
          style: "primary",
          disable: dungeon.getRelativeChamber("down", dungeon.x, dungeon.y) == undefined,
          function: async () => {
            await runCommand("move", ["down"]);
          },
        },
        {
          id: "right",
          emoji: emojis.right,
          style: "primary",
          disable: dungeon.getRelativeChamber("right", dungeon.x, dungeon.y) == undefined,
          function: async () => {
            await runCommand("move", ["right"]);
          },
        },
      ],
    },
  ]);

  //* Boards
  menu.setBoards([
    {
      name: "main",
      message: "main",
      rows: ["movement1", "movement2"],
    },
  ]);

  // Initialise menu
  menu.init("main");

  //* EMITTER FUNCTIONS ===============================================================================

  game.emitter.on("playerMoveInDungeon", onPlayerMoveInDungeon);

  /** Update when the player moves to a new tile. */
  async function onPlayerMoveInDungeon({ dungeon: newDungeon }: DungeonMoveEmitter) {
    // Update dungeon with new data
    Object.assign(dungeon, newDungeon);

    // Refresh the menu
    menu.refresh();
  }

  //* FUNCTIONS ===============================================================================

  /** Execute a command as the party leader. */
  async function runCommand(name: string, args: string[]) {
    await game.runCommand(name, {
      server: leader.server,
      discordId: leader.user.discordId,
      channel: leader.channel,
      args,
    });
  }
}
