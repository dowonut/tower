import {
  ButtonInteraction,
  ChannelType,
  CollectorOptions,
  Interaction,
  InteractionType,
  StageChannel,
  StringSelectMenuInteraction,
} from "discord.js";
import { game } from "../../../tower.js";

/**
 * Create a collector for Discord message components.
 */
export default async function componentCollector<T>(
  message: Message,
  reply: Message,
  components: Component[],
  menu?: TowerMenu<T>,
  args: {
    unique?: boolean;
    filter?: (i: Interaction) => boolean;
    max?: number;
  } = {}
): Promise<unknown> {
  if (!components || !components[0]) return undefined;
  const { unique = true } = args;

  return new Promise((resolve, reject) => {
    let filter = (i: any) => i.message.id == reply.id;

    if (unique) {
      filter = (i: any) =>
        i.user.id == message.author.id && i.message.id == reply.id;
    }

    if (args.filter) {
      filter = args.filter;
    }

    // Define collector settings
    let collectorSettings: any = {
      filter,
      time: 5 * 60 * 1000,
    };

    if (args.max) {
      collectorSettings.max = args.max;
    }

    // Return if stage channel
    // if (message.channel.type == ChannelType.GuildStageVoice) return;

    const collector =
      message.channel.createMessageComponentCollector(collectorSettings);

    collector.on("collect", async (i) => {
      let index: number;
      index = components.findIndex((x) => x.id == i.customId);

      const component = components[index];

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
        const response = await component.function(reply, i, selection);
        // Resolve the promise
        resolve(response);
      }
      // If component is a modal then open it and delete message
      else if (component.modal) {
        const userResponse = await game.modal(component.modal, i);
        // await reply.delete();
        // Run component function
        if (component.modal.function) {
          const response = await component.modal.function(userResponse);
          resolve(response);
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
    //   await reply.edit({ components: [] });
    //   return resolve(undefined);
    // });
  });
}
