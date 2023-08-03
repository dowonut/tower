import Discord from "discord.js";

import generic from "../game/_classes/generic.ts";

import { playerFunctions } from "../tower.js";

import * as Prisma from "@prisma/client";
import { Prisma as PrismaClient } from "@prisma/client";

import PlayerClass from "../game/_classes/players.ts";

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
    arguments?: CommandArgument[];
    /** Category the command belongs to. */
    category?: CommandCategory;
    /** Command cooldown. */
    cooldown?: string;
    /** The command can only be used by Dowonut. Default: false. */
    dev?: boolean;
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
    /** The command can only be used when in a party. Default: false. */
    partyOnly?: boolean;
    /** The command can only be used once unlocked. Default: true. */
    mustUnlock?: boolean;
    /** The main command function. */
    execute: Execute;
  }

  /**
   * Dynamic command arguments.
   */
  export interface CommandArgument {
    name: string;
    /** Argument is required. Default: true. */
    required?: boolean;
    /** Require argument to be specific type. */
    type?: CommandArgumentType;
    /** Check argument against filter. */
    filter?: (
      input: string,
      player: Player,
      args: any
    ) => Promise<CommandArgumentFilterResult> | CommandArgumentFilterResult;
  }

  /**
   * Object containing parsed player arguments.
   */
  type CommandParsedArguments = { [key: string]: string | any };

  /**
   * Object to return for command argument filters.
   */
  type CommandArgumentFilterResult =
    | { success: true; content?: any; message?: void }
    | { success: false; message: string; content?: void };

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
    (
      message: Message,
      args: CommandParsedArguments,
      player: Player,
      server: Server
    ): Promise<any>;
  }

  /**
   * Main command function without player requirement.
   */
  interface ExecuteNoPlayer {
    (
      message: Message,
      args: CommandParsedArguments,
      player: Player | void,
      server: Server
    ): Promise<any>;
  }

  /**
   * Server
   */
  export type Server = {} & Prisma.Server;

  /**
   * User
   */
  export type User = {} & Prisma.User;

  /** Player Prisma Model */
  type PlayerModel = PrismaClient.PlayerGetPayload<{
    include: {
      encounter: { include: { players: true; enemies: true } };
      party: { include: { players: { include: { user: true } } } };
      inventory: true;
    };
  }>;

  /**
   * Player base
   */
  export type PlayerBase = {
    message?: Message;
    server?: Server;
    user?: User;
  } & PlayerModel &
    typeof playerFunctions;

  /**
   * Player
   */
  export type Player = PlayerClass;

  /**
   * Player appearance configuration.
   */
  export type PlayerAppearance = {
    hair: PlayerAppearanceType;
    torso: PlayerAppearanceType;
    legs: PlayerAppearanceType;
    skin: string;
    eyes: string;
  };

  export type PlayerAppearanceType = {
    name: string;
    color?: string;
  };

  // /**
  //  * Player class.
  //  */
  // export interface PlayerClass {
  //   [key: string]: PlayerFunction;
  // }

  /**
   * Player function.
   */
  export type PlayerFunction = (this: Player, ...args: any) => any;

  /**
   * Generic class object with methods.
   */
  export type Generic<T> = T & typeof generic;
}
