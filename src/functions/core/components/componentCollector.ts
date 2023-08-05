import {
  ButtonInteraction,
  ChannelType,
  Collector,
  CollectorOptions,
  Interaction,
  InteractionCollector,
  InteractionType,
  StageChannel,
  StringSelectMenuInteraction,
  TextChannel,
} from "discord.js";
import { game } from "../../../tower.js";

/**
 * Create a collector for Discord message components.
 */
export default async function componentCollector<T>(args: CollectorArgs<T>): Promise<InteractionCollector<any>> {
  const { message, reply, components, menu, options = {} } = args;
  const { unique = true, max } = options;
  const channel = message?.channel || args.channel;

  if (!components || !components[0]) return undefined;
  if (!message && !args.channel) return;

  return new Promise((resolve, reject) => {
    let filter = (i: any) => i.message.id == reply.id;

    if (unique) {
      filter = (i: any) => i.user.id == message?.user.discordId && i.message.id == reply.id;
    }

    if (options.filter) {
      filter = options.filter;
    }

    // console.log("> Filter: ", args.filter);

    // Define collector settings
    let collectorSettings: any = {
      filter,
      time: 60 * 60 * 1000,
    };

    if (max) {
      collectorSettings.max = max;
    }

    // Return if stage channel
    // if (message.channel.type == ChannelType.GuildStageVoice) return;

    const collector = channel.createMessageComponentCollector(collectorSettings);

    resolve(collector);

    collector.on("collect", async (i: ButtonInteraction | StringSelectMenuInteraction) => {
      let index: number;
      index = components.findIndex((x) => x.id == i.customId);

      const component = components[index];

      // console.log("> Component: ", component);

      // Return if no component provided
      if (!component) return;

      // Defer interaction update
      if (!component.modal) {
        try {
          await i.deferUpdate();
        } catch (err) {
          return;
        }
      }

      // If component has a function then run it
      if (component.function) {
        // Get selection as function ID
        let selection: string;
        if (i instanceof StringSelectMenuInteraction) {
          selection = i.values ? i.values[0] : undefined;
        }
        // Get response as return from component function
        await component.function(reply, i, selection);
      }
      // If component is a modal then open it and delete message
      else if (component.modal) {
        const userResponse = await game.modal(component.modal, i);
        // await reply.delete();
        // Run component function
        if (component.modal.function) {
          await component.modal.function(userResponse, i);
        }
      }

      // If menu class attached then perform special functions
      if (menu) {
        if (component.board) {
          await menu.switchBoard(component.board);
          collector.stop();
        }
      }

      // If component stops collector
      if (component.stop) {
        collector.stop();
      }
    });

    // collector.on("end", async () => {
    //   console.log("collector ended");
    // });
  });
}
