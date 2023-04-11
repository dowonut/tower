import { game } from "../../tower.js";

const categories = ["hair", "torso", "legs", "skin"];

export default {
  name: "character",
  aliases: ["ch"],
  description: "Edit your character's appearance.",
  dev: true,
  async execute(message, args, player, server) {
    const menu = new game.Menu({
      message,
      variables: { currentCategory: undefined },
      boards: {
        categories: {
          rows: [
            {
              type: "buttons",
              components: (m) => {
                return categories.map((x) => {
                  return {
                    id: x,
                    label: game.titleCase(x),
                    disable: x == m.variables.currentCategory ? true : false,
                    function() {
                      m.variables.currentCategory = x;
                      m.refresh();
                    },
                  };
                });
              },
            },
          ],
          message: () =>
            game.send({ message, send: false, content: "**Character**" }),
        },
      },
    });

    menu.init("categories");
  },
} as Command;
