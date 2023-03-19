import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SelectMenuBuilder,
} from "discord.js";

/**
 * A component button.
 * @typedef {object} Button
 * @property {string} id - Button id.
 * @property {string} label - Button label.
 * @property {"primary"|"secondary"|"success"|"danger"|"link"} style - Button style.
 */

/**
 *
 * @param {"buttons"|"menu"} type
 * @param {Array.<Button>} components
 * @returns
 */
export default function actionRow(type, components) {
  if (!components || components.length < 1) return undefined;

  if (type == "buttons") {
    const row = new ActionRowBuilder();

    for (const component of components) {
      let buttonStyle;
      switch (component.style) {
        case "primary":
          buttonStyle = ButtonStyle.Primary;
          break;
        case "secondary":
          buttonStyle = ButtonStyle.Secondary;
          break;
        case "success":
          buttonStyle = ButtonStyle.Success;
          break;
        case "danger":
          buttonStyle = ButtonStyle.Danger;
          break;
        case "link":
          buttonStyle = ButtonStyle.Link;
          break;
        case undefined:
          buttonStyle = ButtonStyle.Secondary;
          break;
      }

      const button = new ButtonBuilder();

      if (!component.id) return console.error("Must provide an id.");

      if (!component.label && !component.emoji)
        return console.error("Must provide either label or emoji.");

      if (component.disable && component.disable == true)
        button.setDisabled(true);

      if (component.label) button.setLabel(component.label);
      if (component.emoji) button.setEmoji(component.emoji);
      button.setCustomId(component.id);
      button.setStyle(buttonStyle);

      row.addComponents(button);
    }

    return row;
  } else if (type == "menu") {
    const row = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId(components.id)
        .setPlaceholder(components.placeholder)
        .addOptions(...components.options)
    );

    return row;
  }
}
