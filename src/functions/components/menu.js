export default {
  menu: class Menu {
    constructor(buttons, game, type = "buttons") {
      this.buttons = buttons();

      this.row = game.actionRow(type, this.buttons);

      this.collector = async (message, reply) => {
        let components = this.buttons;
        if (type == "menu") components = [this.buttons];
        return await game.componentCollector(message, reply, components);
      };

      this.updateButtons = async (reply) => {
        const newButtons = buttons();

        const row = game.actionRow(type, newButtons);

        if (!row) return await reply.edit({ components: [] });

        return await reply.edit({ components: [row] });
      };
    }
  },
};
