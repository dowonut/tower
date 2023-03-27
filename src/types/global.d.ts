import Discord from "discord.js";

import generic from "../game/classes/generic.ts";

import { ItemClass } from "../game/classes/items.js";
import { playerFunctions } from "../tower.js";

import * as Prisma from "@prisma/client";

declare global {
  /**
   * Tower client extension of Discord client.
   */
  export interface TowerClient extends Discord.Client {
    commands?: Discord.Collection<string, Command>;
    cooldowns?: Discord.Collection<string, Discord.Collection<string, number>>;
  }

  /**
   * User command object.
   */
  export interface Command {
    /** Name of the command. */
    name: string;
    /** Description of the command. */
    description: string;
    /** Aliases of the command. */
    aliases?: string[];
    /** User arguments for the command. */
    arguments?: string;
    /** Category the command belongs to. */
    category?: CommandCategory;
    /** Command cooldown. */
    cooldown?: string;
    /** The command is exclusive to admins. Default: false. */
    admin?: boolean;
    /** A character is required to run the command. Default: true. */
    needChar?: boolean;
    /** The command can only be used in combat. Default: false.*/
    useInCombatOnly?: boolean;
    /** The command can be used in combat. Default: false.*/
    useInCombat?: boolean;
    /** Ignore the command in the help menu. Default: false. */
    ignoreInHelp?: boolean;
    /** The main command function. */
    execute: Execute;
  }

  /**
   * User command object without player requirement.
   */
  export interface CommandNoPlayer extends Omit<Command, "execute"> {
    execute: ExecuteNoPlayer;
  }

  /**
   * Main command function.
   */
  export interface Execute {
    (message: Message, args: string[], player: Player, server: any): void;
  }

  /**
   * Main command function without player requirement.
   */
  interface ExecuteNoPlayer {
    (
      message: Message,
      args: string[],
      player: Player | void,
      server: any
    ): void;
  }

  /**
   * Server
   */
  export type Server = {} & Prisma.Server;

  /**
   * User
   */
  export type User = {} & Prisma.User;

  /**
   * Player
   */
  export type Player = {
    message?: Message;
    server?: Server;
    user?: User;
  } & Prisma.Player &
    typeof playerFunctions;

  /**
   * Player class.
   */
  export interface PlayerClass {
    [key: string]: PlayerFunction;
  }

  /**
   * Player function.
   */
  export type PlayerFunction = (this: Player, ...args: any) => any;

  /**
   * Discord embed.
   */
  export type Embed = {} & Partial<Discord.Embed>;

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
    ): Promise<void>;
  }

  /**
   * Item class.
   */
  export type Item = ItemClass;

  /**
   * Item base definition.
   */
  export type ItemBase = Prisma.Inventory & ItemData;

  /**
   * Item data.
   */
  export type ItemData = {
    name: string;
    category: ItemCategory;
    weaponType?: WeaponType;
    description?: string;
    info: string;
    /** Health regained if consumable. */
    health?: number;
    /** Resell value if sellable. */
    value?: number;
    equipSlot?: EquipSlot;
    /** Base weapon damage. */
    damage?: number;
    /** Base tool sharpness. */
    sharpness?: number;
    damageType?: DamageType;
  };

  /**
   * Generic class object with methods.
   */
  export type Generic<T> = T & typeof generic;
}
