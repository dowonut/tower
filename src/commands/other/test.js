export default {
  name: "test",
  aliases: ["te"],
  arguments: "",
  description: "For testing purposes.",
  category: "Admin",
  async execute(message, args, prisma, config, player, game, server) {
    // const button = [
    //   {
    //     id: "test",
    //     emoji: "✅",
    //     style: "secondary",
    //     function: (reply) => {
    //       reply.edit({ content: "**`You're mom.`**", components: [] });
    //       return game.titleCase("hi");
    //     },
    //   },
    // ];

    // const menu = {
    //   id: "menu",
    //   placeholder: "Nothing selected",
    //   options: [
    //     {
    //       label: "Option 1",
    //       description: "The best option",
    //       value: "option1",
    //     },
    //   ],
    //   function: (reply, i) => {
    //     const selection = i.values[0];
    //     reply.edit({ content: "**`Selected something.`**", components: [] });
    //     return selection;
    //   },
    // };
    // const row1 = game.actionRow("buttons", button);
    // const row2 = game.actionRow("menu", menu);

    // const reply = await message.reply({
    //   content: "**`Press the button bitch.`**",
    //   components: [row1, row2],
    // });

    // const response = await game.componentCollector(message, reply, [
    //   ...button,
    //   menu,
    // ]);

    return;
  },
};
