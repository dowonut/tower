import {
  ActionRowBuilder,
  ActionRowData,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} from "discord.js";

export type RowType = "buttons" | "menu";

/**
 * Create Discord row for components.
 */
export default function actionRow<K, T extends RowType>(
  type: T,
  components: Button[] | SelectMenu,
  menu?: TowerMenu<K>
): T extends "buttons"
  ? ActionRowBuilder<ButtonBuilder>
  : ActionRowBuilder<StringSelectMenuBuilder> {
  if (!components) return undefined;

  if (type == "buttons" && Array.isArray(components)) {
    const row = new ActionRowBuilder<ButtonBuilder>();

    for (let component of components) {
      let buttonStyle: ButtonStyle;

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

      if (component.disable && component.disable == true) button.setDisabled(true);

      if (component.label) button.setLabel(component.label);
      if (component.emoji) button.setEmoji(component.emoji);
      if (component.style !== "link") {
        button.setCustomId(component.id);
      } else {
        button.setURL(component.url);
      }
      button.setStyle(buttonStyle);

      row.addComponents(button);
    }

    return row as any;
  } else if (type == "menu" && !Array.isArray(components)) {
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(components.id)
        .setPlaceholder(components.placeholder)
        .addOptions(...components.options)
    );

    return row as any;
  }
}
