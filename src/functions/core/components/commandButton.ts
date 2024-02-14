import { config, game } from "../../../tower.js";

export type CommandButtonCommand = {
  /** Name of the command to execute. */
  name: string;
  /** Args to pass to the command. */
  args?: string[];
  /** Optional button label. Defaults to command name. */
  label?: string;
  emoji?: string;
  style?: ButtonStyle;
};

/**
 * Attach a button component to a message that triggers a command.
 */
export default async function commandButton(obj: {
  commands: CommandButtonCommand[];
  player: Player;
  botMessage: Message;
  wait?: boolean;
}) {
  const { botMessage, commands, player, wait = false } = obj;

  if (!wait) {
    await addButton();
  } else {
    setTimeout(async () => {
      await addButton();
    }, 1000);
  }

  async function addButton() {
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
                label: x?.label || game.titleCase(x.name),
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
}
