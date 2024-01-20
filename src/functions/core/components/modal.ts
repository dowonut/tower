import {
  ActionRowBuilder,
  AutocompleteInteraction,
  ButtonInteraction,
  Interaction,
  ModalBuilder,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

import { game, config } from "../../../tower.js";

/** Show Discord model through interaction. */
export default async function modal(
  args: Modal,
  interaction: ButtonInteraction | StringSelectMenuInteraction
): Promise<ModalResponse[]> {
  return new Promise(async (resolve, reject) => {
    const modal = new ModalBuilder();

    modal.setCustomId(args.id);
    modal.setTitle(args.title);

    // Iterate opponents
    for (const component of args.components) {
      let inputStyle: TextInputStyle;
      if (component.style == "short") {
        inputStyle = TextInputStyle.Short;
      } else if (component.style == "paragraph") {
        inputStyle = TextInputStyle.Paragraph;
      }

      const input = new TextInputBuilder();

      input.setCustomId(component.id);
      input.setLabel(component.label);
      input.setStyle(inputStyle);

      const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input);

      modal.addComponents(row);
    }

    // Return if wrong interaction type
    if (interaction instanceof ModalSubmitInteraction || interaction instanceof AutocompleteInteraction) return;

    try {
      // console.log("showing modal...");
      await interaction.showModal(modal);
    } catch (err) {
      console.log("failed to show modal");
    }

    const filter = (i: Interaction) => i.user.id == interaction.user.id;

    const submitted = await interaction
      .awaitModalSubmit({
        filter,
        time: 60 * 1000,
      })
      .catch((error) => {});

    if (!submitted) return;

    const responses = submitted.fields.fields.map((x) => {
      return { id: x.customId, value: x.value };
    });

    try {
      await submitted.deferUpdate();
    } catch (err) {}

    resolve(responses);
  });
}
