import Discord from "discord.js";

import generic from "../game/_classes/generic.ts";

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
   * Generic class object with methods.
   */
  export type Generic<T> = T & typeof generic;
}
