import Discord from "discord.js";

declare global {
  /**
   * Discord embed.
   */
  export type Embed = {
    color?: number;
    title?: string;
    url?: string;
    author?: {
      name: string;
      icon_url?: string;
      url?: string;
    };
    description?: string;
    thumbnail?: {
      url: string;
    };
    fields?: { name: string; value: string; inline?: boolean }[];
    image?: {
      url: string;
    };
    footer?: {
      text: string;
      icon_url?: string;
    };
  }; //& Partial<Discord.Embed>;

  /**
   * Discord message.
   */
  export type Message<T = Discord.TextChannel> = Modify<
    Discord.Message,
    { channel: T }
  >;

  /**
   * Discord message options.
   */
  export type MessageOptions = {} & Discord.MessageCreateOptions;

  /**
   * Discord component.
   */
  export type Component = Button | SelectMenu;

  /**
   * Discord button component.
   */
  export interface Button {
    id: string;
    label?: string;
    emoji?: string;
    style?: "primary" | "secondary" | "success" | "danger" | "link";
    disable?: boolean;
    url?: string;
    stop?: boolean;
    modal?: Modal;
    function?: ComponentFunction;
  }

  /**
   * Discord select menu component.
   */
  export interface SelectMenu {
    id: string;
    placeholder: string;
    options: SelectMenuOption[];
    stop?: boolean;
    modal?: Modal;
    function: ComponentFunction;
  }

  /**
   * Discord modal component.
   */
  export interface Modal {
    id: string;
    title: string;
    components: { style: "short" | "paragraph"; id: string; label: string }[];
  }

  /**
   * Discord select menu component option.
   */
  export interface SelectMenuOption {
    label: string;
    value: string;
    description?: string;
  }

  /**
   * Function to run when component is selected.
   */
  interface ComponentFunction {
    (
      reply?: Message,
      interaction?: Discord.Interaction,
      selection?: string
    ): Promise<any>;
  }
}
export {};
