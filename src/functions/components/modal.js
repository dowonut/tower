import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

import * as config from "../../config.js";

export default {
  modal: async (modalInfo, interaction) => {
    return new Promise(async (resolve, reject) => {
      const modal = new ModalBuilder();

      modal.setCustomId(modalInfo.id);
      modal.setTitle(modalInfo.title);

      for (const component of modalInfo.components) {
        let inputStyle;
        if (component.style == "short") {
          inputStyle = TextInputStyle.Short;
        } else if (component.style == "paragraph") {
          inputStyle = TextInputStyle.Paragraph;
        }

        const input = new TextInputBuilder();

        input.setCustomId(component.id);
        input.setLabel(component.label);
        input.setStyle(inputStyle);

        const row = new ActionRowBuilder().addComponents(input);

        modal.addComponents(row);
      }

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

      const responses = submitted.fields.fields.map((x) => {
        return { id: x.customId, value: x.value };
      });

      console.log(interaction.user);

      let replyText = ``;
      for (const response of responses) {
        replyText += `\n${config.emojis.bullet} **${response.id}:**\n\`${response.value}\``;
      }
      const username =
        interaction.user.username + "#" + interaction.user.discriminator;

      const embed = {
        color: config.botColor,
        author: {
          name: "Submitted Form",
          icon_url: interaction.user.displayAvatarURL({
            dynamic: false,
            size: 128,
            format: "png",
          }),
        },
        description: replyText,
      };

      await submitted.reply({ embeds: [embed] });
      //await submitted.reply({ content: modalInfo.reply(response) });

      resolve(responses);
    });
  },
};
