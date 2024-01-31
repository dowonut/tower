import { game, prisma } from "../../tower.js";
import emojis from "../../emojis.js";

export default {
  name: "wardrobe",
  aliases: ["wd"],
  description: "Customize your appearance.",
  category: "player",
  environment: ["protected"],
  async execute(message, args, player, server) {
    const data: PlayerWardrobe = player.wardrobe || {
      eyes: "black",
      skin: "white",
      hair: { name: "short", color: "red" },
      legs: { name: "trousers", color: "brown" },
      torso: { name: "plain_shirt", color: "pink" },
      feet: { name: "shoes", color: "black" },
    };

    const menu = new game.Menu({
      variables: { currentCategory: undefined, data, previousData: undefined },
      player,
      rows: [
        // Skin and eye color
        {
          name: "skin_and_eyes",
          type: "buttons",
          components: (m) => [
            {
              id: "skin",
              label: "Skin",
              style: "primary",
              emoji: emojis.eye_dropper,
              modal: getColorModal(m, "skin"),
            },
            {
              id: "eyes",
              label: "Eyes",
              style: "primary",
              emoji: emojis.eye_dropper,
              modal: getColorModal(m, "eyes"),
            },
          ],
        },
        // Clothing
        {
          name: "clothing",
          type: "buttons",
          components: (m) => [
            {
              id: "hair",
              label: "Hair",
              function() {
                m.variables.currentCategory = "hair";
              },
              board: "category",
            },
            {
              id: "torso",
              label: "Torso",
              function() {
                m.variables.currentCategory = "torso";
              },
              board: "category",
            },
            {
              id: "legs",
              label: "Legs",
              function() {
                m.variables.currentCategory = "legs";
              },
              board: "category",
            },
            {
              id: "feet",
              label: "Feet",
              function() {
                m.variables.currentCategory = "feet";
              },
              board: "category",
            },
          ],
        },
        // Other functions
        {
          name: "functions",
          type: "buttons",
          components: (m) => [{ id: "randomize", label: "Randomize", style: "danger" }],
        },
        // Clothing dropdown
        {
          name: "select_clothing",
          type: "menu",
          components: async (m) => ({
            id: "select_clothing",
            options: (await m.player.getCosmetics())[m.variables.currentCategory].map((x) => ({
              label: game.titleCase(x),
              value: x,
              default: x == m.variables.data[m.variables.currentCategory].name,
              emoji: x == "nothing" ? emojis.red_x : undefined,
            })),
            placeholder: "Select a cosmetic to equip...",
            function: (r, i, s) => {
              m.variables.data[m.variables.currentCategory].name = s;
              m.refresh();
            },
          }),
        },
        // Other clothing functions
        {
          name: "clothing_functions",
          type: "buttons",
          components: (m) => [
            {
              id: "color",
              emoji: emojis.eye_dropper,
              style: "primary",
              modal: getColorModal(m, m.variables.currentCategory),
            },
            {
              id: "return",
              board: "main",
            },
          ],
        },
      ],
      messages: [
        {
          // Message showing player character image
          name: "main",
          async function(m) {
            // If no changes to wardrobe
            if (JSON.stringify(m.variables.data) === JSON.stringify(m.variables.previousData)) {
              return;
            }
            // If changes detected then generate new image
            else {
              m.variables.previousData = JSON.parse(JSON.stringify(m.variables.data));
              let image = await m.player.createCharacterImage(m.variables.data);
              await m.player.update({ wardrobe: m.variables.data });
              return await game.fastEmbed({
                player: m.player,
                fullSend: false,
                files: [image],
                title: "Wardrobe",
                embed: { image: { url: `attachment://${m.player.user.discordId}.png` } },
                reply: true,
              });
            }
          },
        },
      ],
      boards: [
        { name: "main", message: "main", rows: ["skin_and_eyes", "clothing", "functions"] },
        { name: "category", message: "main", rows: ["select_clothing", "clothing_functions"] },
      ],
    });

    menu.init("main");
  },
} satisfies Command;

/** Get a modal for color input. */
function getColorModal(menu: any, category: keyof PlayerWardrobe) {
  return {
    components: [{ id: "color", style: "short", label: "Color name or HEX code:" }],
    id: `${category}_color`,
    title: `Change ${game.titleCase(category)} Color`,
    function: (r, i) => {
      if (!r[0]) return;
      const newColor = r[0].value;

      if (category == "eyes" || category == "skin") {
        menu.variables.data[category] = newColor;
      } else {
        menu.variables.data[category].color = newColor;
      }

      menu.refresh();
    },
  } satisfies Modal;
}
