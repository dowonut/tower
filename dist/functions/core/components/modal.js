import { ActionRowBuilder, AutocompleteInteraction, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle, } from "discord.js";
import { config } from "../../../tower.js";
/** Show Discord model through interaction. */
export default async function modal(args, interaction) {
    return new Promise(async (resolve, reject) => {
        const modal = new ModalBuilder();
        modal.setCustomId(args.id);
        modal.setTitle(args.title);
        // Iterate opponents
        for (const component of args.components) {
            let inputStyle;
            if (component.style == "short") {
                inputStyle = TextInputStyle.Short;
            }
            else if (component.style == "paragraph") {
                inputStyle = TextInputStyle.Paragraph;
            }
            const input = new TextInputBuilder();
            input.setCustomId(component.id);
            input.setLabel(component.label);
            input.setStyle(inputStyle);
            const row = new ActionRowBuilder().addComponents(input);
            modal.addComponents(row);
        }
        // Return if wrong interaction type
        if (interaction instanceof ModalSubmitInteraction ||
            interaction instanceof AutocompleteInteraction)
            return;
        await interaction.showModal(modal);
        const filter = (i) => i.user.id == interaction.user.id;
        const submitted = await interaction
            .awaitModalSubmit({
            filter,
            time: 60 * 1000,
        })
            .catch((error) => {
            resolve(undefined);
        });
        if (!submitted)
            return;
        const responses = submitted.fields.fields.map((x) => {
            return { id: x.customId, value: x.value };
        });
        let replyText = ``;
        for (const response of responses) {
            replyText += `\n${config.emojis.bullet} **${response.id}:**\n\`${response.value}\``;
        }
        const username = interaction.user.username + "#" + interaction.user.discriminator;
        const embed = {
            color: config.botColor,
            author: {
                name: "Submitted Form",
                icon_url: interaction.user.displayAvatarURL({
                    size: 128,
                    extension: "png",
                }),
            },
            description: replyText,
        };
        await submitted.reply({ embeds: [embed] });
        //await submitted.reply({ content: args.reply(response) });
        resolve(responses);
    });
}
