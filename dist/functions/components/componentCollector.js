import { ChannelType, StringSelectMenuInteraction, } from "discord.js";
import { game } from "../../tower.js";
/**
 * Create a collector for Discord message components.
 */
export default async function componentCollector(message, reply, components, args = {}) {
    if (!components || !components[0])
        return undefined;
    const unique = args.unique ? args.unique : true;
    return new Promise((resolve, reject) => {
        let filter = (i) => i.message.id == reply.id;
        if (unique) {
            filter = (i) => i.user.id == message.author.id && i.message.id == reply.id;
        }
        if (args.filter) {
            filter = args.filter;
        }
        // Define collector settings
        let collectorSettings = {
            filter,
            time: 5 * 60 * 1000,
        };
        if (args.max) {
            collectorSettings.max = args.max;
        }
        // Return if stage channel
        if (message.channel.type == ChannelType.GuildStageVoice)
            return;
        const collector = message.channel.createMessageComponentCollector(collectorSettings);
        collector.on("collect", async (i) => {
            let index;
            index = components.findIndex((x) => x.id == i.customId);
            const component = components[index];
            // Return if no component provided
            if (!component)
                return;
            // Defer interaction update
            try {
                await i.deferUpdate();
            }
            catch (err) {
                return;
            }
            // If component has a function then run it
            if (component.function) {
                // Get selection as function ID
                let selection;
                if (i instanceof StringSelectMenuInteraction) {
                    selection = i.values ? i.values[0] : undefined;
                }
                // Get response as return from component function
                const response = await component.function(reply, i, selection);
                // Resolve the promise
                resolve(response);
            }
            // If component is a modal then open it and delete message
            else if (component.modal) {
                const response = await game.modal(component.modal, i);
                await reply.delete();
                resolve(response);
            }
            // If component stops collector
            if (component.stop) {
                collector.stop();
            }
        });
        // collector.on("end", async () => {
        //   await reply.edit({ components: [] });
        //   return resolve(undefined);
        // });
    });
}
