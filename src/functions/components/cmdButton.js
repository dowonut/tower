export default {
  cmdButton: async (message, reply, commandArgs) => {
    const commandName = commandArgs[0];

    const menu = new game.menu(() => {
      return [
        {
          id: commandName,
          label: game.titleCase(commandName),
          style: "secondary",
          function: () => {
            reply.edit({ components: [] });
            return game.runCommand(...commandArgs);
          },
        },
      ];
    });

    menu.updateButtons(reply);

    menu.collector(message, reply);
  },
};