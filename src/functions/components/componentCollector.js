import modalF from "./modal.js";
const { modal } = modalF;
import rowF from "./actionRow.js";
const { actionRow } = rowF;

export default {
  componentCollector: async (message, reply, components) => {
    if (!components || !components[0]) return undefined;

    return new Promise((resolve, reject) => {
      const filter = (i) =>
        i.user.id == message.author.id && i.message.id == reply.id;

      const collector = message.channel.createMessageComponentCollector({
        filter,
        time: 5 * 60 * 1000,
      });

      collector.on("collect", async (i) => {
        const index = components.findIndex((x) => x.id == i.customId);
        const component = components[index];

        // Return if no component provided
        if (!component) return;

        // Defer interaction update
        await i.deferUpdate();

        // If component has a function then run it
        if (component.function) {
          // Get selection as function ID
          const selection = i.values ? i.values[0] : undefined;
          // Get response as return from component function
          const response = await component.function(reply, i, selection);
          // Resolve the promise
          resolve(response);
        }
        // If component is a modal then open it and delete message
        if (component.modal) {
          const response = await modal(component.modal, i);
          await reply.delete();
          resolve(response);
        }

        // If component stops collector
        if (component.stop) {
          await collector.stop();
        }
      });

      // collector.on("end", async () => {
      //   await reply.edit({ components: [] });
      //   return resolve(undefined);
      // });
    });
  },
};
