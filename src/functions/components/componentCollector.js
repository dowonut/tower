import modalF from "./modal.js";
const { modal } = modalF;

export default {
  componentCollector: async (message, reply, components) => {
    return new Promise((resolve, reject) => {
      const filter = (i) =>
        i.user.id == message.author.id && i.message.id == reply.id;

      const collector = message.channel.createMessageComponentCollector({
        filter,
        time: 120 * 1000,
      });

      collector.on("collect", async (i) => {
        const component = components.find((x) => x.id == i.customId);

        if (!component) return;

        if (component.function) {
          const selection = i.values[0] ? i.values[0] : undefined;
          const response = await component.function(reply, i, selection);
          resolve(response);
        }
        if (component.modal) {
          const response = await modal(component.modal, i);
          await reply.delete();
          resolve(response);
        }

        if (component.stop) collector.stop();
      });

      // collector.on("end", async () => {
      //   await reply.edit({ components: [] });
      //   return resolve(undefined);
      // });
    });
  },
};
