import { ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } from "discord.js";
import { game } from "../../../tower.js";
import { RowType } from "./actionRow.js";

export default class OldMenu {
  buttons: Button[];
  row: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>;
  type: RowType;

  constructor(buttons: () => Button[], type: RowType = "buttons") {
    this.buttons = buttons();
    this.type = type;

    this.row = game.actionRow(this.type, this.buttons);
  }

  /**
   * Refresh all buttons.
   */
  async updateButtons(reply: Message) {
    const newButtons = this.buttons;

    const row = game.actionRow(this.type, newButtons);

    if (!row) return await reply.edit({ components: [] });

    return await reply.edit({ components: [row] });
  }

  async collector(message: Message, reply: Message) {
    let components: Button[] | SelectMenu = this.buttons;
    // if (this.type == "menu") components = [this.buttons];
    // return await game.componentCollector(message, reply, components);
  }
}
