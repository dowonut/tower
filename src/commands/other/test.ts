import { game, config, prisma, client } from "../../tower.js";

export default {
  name: "test",
  aliases: ["te"],
  description: "For testing purposes.",
  category: "admin",
  dev: true,
  async execute(message, args, player, server) {
    const menu = new game.Menu({
      message,
      variables: { somethingCool: "number: 1" },
      boards: {
        hi: {
          rows: [
            {
              type: "buttons",
              components: async (m) => {
                return [
                  {
                    id: "1",
                    label: "1",
                    async function() {
                      m.variables.somethingCool = "number: 1";
                      m.refresh();
                    },
                  },
                  {
                    id: "2",
                    label: "2",
                    async function() {
                      m.variables.somethingCool = "number: 2";
                      m.refresh();
                    },
                  },
                  {
                    id: "3",
                    label: "switch",
                    board: "bye",
                  },
                ] satisfies Button[];
              },
            },
          ],
          async message(m) {
            const yeah = m.variables.somethingCool;
            return await game.send({
              message,
              content: yeah,
              send: false,
            });
          },
        },
        bye: {
          rows: [
            {
              type: "buttons",
              components: () => [{ id: "return", board: "hi" }] as Button[],
            },
          ],
        },
      },
    });

    menu.init("hi");
  },
} as Command;
