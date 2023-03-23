import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, } from "discord.js";
/**
 * Create Discord row for components.
 */
export default function actionRow(type, components) {
    if (!components)
        return undefined;
    if (type == "buttons" && Array.isArray(components)) {
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
            if (!component.id && component.style !== "link")
                return console.error("Must provide an id.");
            if (!component.label && !component.emoji)
                return console.error("Must provide either label or emoji.");
            if (component.disable && component.disable == true)
                button.setDisabled(true);
            if (component.label)
                button.setLabel(component.label);
            if (component.emoji)
                button.setEmoji(component.emoji);
            if (component.style !== "link") {
                button.setCustomId(component.id);
            }
            else {
                if (!component.url)
                    return console.error("Must provide URL for link button.");
                button.setURL(component.url);
            }
            button.setStyle(buttonStyle);
            row.addComponents(button);
        }
        return row;
    }
    else if (type == "menu" && !Array.isArray(components)) {
        const row = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder()
            .setCustomId(components.id)
            .setPlaceholder(components.placeholder)
            .addOptions(...components.options));
        return row;
    }
}
