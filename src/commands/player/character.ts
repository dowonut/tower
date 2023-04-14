import { game, config } from "../../tower.js";
import fs from "fs";

const path = "./assets/character/";
const categories = ["hair", "torso", "legs", "skin"];

export default {
  name: "character",
  aliases: ["ch"],
  description: "Edit your character's appearance.",
  dev: true,
  async execute(message, args, player, server) {
    const menu = new game.Menu({
      message,
      variables: {
        currentCategory: undefined,
        currentCategoryAction: undefined,
        configuration: {
          hair: undefined,
          torso: undefined,
          legs: undefined,
          skin: undefined,
        },
      },
      boards: [
        {
          name: "categoryUnselected",
          rows: ["categoryButtons"],
          message: (m) =>
            game.send({ message, send: false, content: "**Character**" }),
        },
        {
          name: "categorySelected",
          rows: ["categoryButtons", "categoryActionButtons"],
        },
        {
          name: "categorySelectType",
          rows: [
            "categoryButtons",
            "categoryActionButtons",
            "categoryTypeSelectMenu",
          ],
        },
        {
          name: "categorySelectColor",
          rows: [
            "categoryButtons",
            "categoryActionButtons",
            "categoryColorButton",
          ],
        },
      ],
      rows: [
        {
          name: "categoryButtons",
          type: "buttons",
          components: async (m) => {
            return categories.map((x) => {
              let board: string;
              if (!m.variables.currentCategoryAction) {
                board = "categorySelected";
              } else if (m.variables.currentCategoryAction == "type") {
                board = "categorySelectType";
              } else if (m.variables.currentCategoryAction == "color") {
                board = "categorySelectColor";
              }
              return {
                id: x,
                label: game.titleCase(x),
                disable: x == m.variables.currentCategory ? true : false,
                board: board,
                function() {
                  m.variables.currentCategory = x;
                },
              };
            });
          },
        },
        {
          name: "categoryActionButtons",
          type: "buttons",
          components: async (m) => {
            return [
              {
                id: "type",
                label: "Type",
                style: "primary",
                board: "categorySelectType",
                disable:
                  m.variables.currentCategoryAction == "type" ? true : false,
                function() {
                  m.variables.currentCategoryAction = "type";
                },
              },
              {
                id: "color",
                label: "Color",
                style: "primary",
                board: "categorySelectColor",
                disable:
                  m.variables.currentCategoryAction == "color" ? true : false,
                function() {
                  m.variables.currentCategoryAction = "color";
                },
              },
              { id: "resetType", label: "Reset", style: "danger" },
            ];
          },
        },
        {
          name: "categoryTypeSelectMenu",
          type: "menu",
          components: async (m) => {
            // Load all options from directory.
            const optionNames: string[] = [];
            const options: SelectMenuOption[] = [];
            try {
              fs.readdirSync(path + m.variables.currentCategory).forEach(
                (file) => {
                  if (file.endsWith(".png")) {
                    const name = file.slice(0, -4);
                    optionNames.push(name);
                    options.push({ label: game.titleCase(name), value: name });
                  }
                }
              );
            } catch (e) {
              options.push({ label: "No options yet!", value: "undefined" });
            }

            return {
              id: "test",
              function(r, i, s) {
                m.variables.configuration[m.variables.currentCategory] = s;
              },
              options: options,
              placeholder: "Select type...",
            } satisfies SelectMenu;
          },
        },
        {
          name: "categoryColorButton",
          type: "buttons",
          components: async (m) => {
            return [
              {
                id: "inputColor",
                label: "Input Color",
                emoji: config.emojis.keyboard,
                modal: {
                  title: "Input Color",
                  id: "inputColorModal",
                  function(response) {
                    console.log(response);
                  },
                  components: [
                    {
                      id: "string",
                      label: "Which color would you like?",
                      style: "short",
                    },
                  ],
                },
              },
            ];
          },
        },
      ],
    });

    menu.init("categoryUnselected");
  },
} as Command;
