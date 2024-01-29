import { config, game } from "../../../tower.js";

/**
 * Attach a button component to a message that triggers a command.
 */
export default async function commandButton(obj: {
  commands: { name: string; args?: string[]; emoji?: string; style?: ButtonStyle }[];
  player: Player;
  botMessage: Message;
}) {
  const { botMessage, commands, player } = obj;

  const menu = new game.Menu({
    player,
    botMessage: botMessage,
    boards: [{ name: "main", rows: ["buttons"] }],
    rows: [
      {
        name: "buttons",
        type: "buttons",
        components: () => {
          return commands.map((x) => {
            return {
              id: x.name,
              label: game.titleCase(x.name),
              emoji: x.emoji ? x.emoji : config.emojis.side_arrow,
              function: async () => {
                await player.runCommand({ name: x.name, args: x?.args });
              },
              style: x.style || "secondary",
            };
          });
        },
      },
    ],
  });

  await menu.init("main");
}
