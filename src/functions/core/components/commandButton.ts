import { game } from "../../../tower.js";

/**
 * Attach a button component to a message that triggers a command.
 */
export default async function commandButton(args: {
  command: string;
  commandArgs?: any[];
  message: Message;
  reply: Message;
  server: Server;
}) {
  const { message, reply, command, commandArgs = [], server } = args;

  const menu = new game.menu(() => {
    return [
      {
        id: command,
        label: game.titleCase(command),
        style: "secondary",
        function: async () => {
          reply.edit({ components: [] });
          game.runCommand(command, { message, server, args: commandArgs });
        },
      },
    ] satisfies Button[];
  });

  menu.updateButtons(reply);

  menu.collector(message, reply);
}
