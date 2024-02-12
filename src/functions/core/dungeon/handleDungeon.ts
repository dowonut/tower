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
    // Main dungeon overview
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
    // Inside specific chamber
    {
      name: "chamber",
      function: (m) => {
        const chamber = dungeon.getChamber(dungeon.x, dungeon.y);
        const title = `${dungeon.getName()} | ${game.titleCase(chamber.type)} Chamber`;
        const thumbnail = dungeon.getChamberImage(chamber.type);

        let description = ``;
        if (chamber.description) description += `*${chamber.description}*`;

        return game.fastEmbed({
          fullSend: false,
          player: leader,
          title,
          description: `Nothing here yet...`,
          files: [thumbnail],
          thumbnail: "attachment://chamber.png",
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
          disable: !dungeon.chamberIsAccessible("up"),
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
          disable: !dungeon.chamberIsAccessible("left"),
          function: async () => {
            await runCommand("move", ["left"]);
          },
        },
        {
          id: "down",
          emoji: emojis.down,
          style: "primary",
          disable: !dungeon.chamberIsAccessible("down"),
          function: async () => {
            await runCommand("move", ["down"]);
          },
        },
        {
          id: "right",
          emoji: emojis.right,
          style: "primary",
          disable: !dungeon.chamberIsAccessible("right"),
          function: async () => {
            await runCommand("move", ["right"]);
          },
        },
      ],
    },
    // Outside chamber interaction buttons
    {
      name: "options",
      type: "buttons",
      components: (m) => [
        {
          id: "enter_chamber",
          label: `Enter ${game.titleCase(dungeon.getChamber(dungeon.x, dungeon.y).type)} Chamber`,
          style: "success",
          emoji: emojis.enter,
          disable: dungeon.completedTiles.some((t) => t.x == dungeon.x && t.y == dungeon.y),
          function: async () => {
            await runCommand("enterchamber");
          },
        },
      ],
    },
    // Options when inside a chamber
    {
      name: "chamber_options",
      type: "buttons",
      components: (m) => {
        let buttons: Button[] = [];

        buttons.push({
          id: "exit_chamber",
          label: "Exit Chamber",
          style: "danger",
          function: () => {
            console.log("exit chamber");
          },
        });

        return buttons;
      },
    },
  ]);

  //* Boards
  menu.setBoards([
    {
      name: "main",
      message: "main",
      rows: ["movement1", "movement2", "options"],
    },
    {
      name: "inside_chamber",
      message: "chamber",
      rows: ["chamber_options"],
    },
  ]);

  // Initialise menu
  menu.init("main");

  //* EMITTER FUNCTIONS ===============================================================================

  game.emitter.on("playerDungeonAction", onPlayerDungeonAction);

  /** Update when the player moves to a new tile. */
  async function onPlayerDungeonAction({ dungeon: newDungeon, action }: DungeonActionEmitter) {
    // Handle different outcomes
    switch (action) {
      //* Enter chamber
      case "enter_chamber":
        await menu.switchBoard("inside_chamber");
        const chamber = dungeon.getChamber(dungeon.x, dungeon.y);
        await onEnterChamber(chamber);
        break;
      //* Default
      default:
        menu.refresh();
        break;
    }

    // Update dungeon with new data
    Object.assign(dungeon, newDungeon);
  }

  //* FUNCTIONS ===============================================================================

  /** Execute a command as the party leader. */
  async function runCommand(name: string, args?: string[]) {
    await game.runCommand(name, {
      server: leader.server,
      discordId: leader.user.discordId,
      channel: leader.channel,
      args,
    });
  }

  /** Handle entering a new chamber. */
  async function onEnterChamber(chamber: DungeonChamber | DungeonChamberBoss) {
    if (chamber.type == "respite") {
      for (const player of players) {
        await game.applyStatusEffect("full heal", player, "other");
      }
    }
  }
}
