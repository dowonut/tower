import { TextChannel } from "discord.js";
import { RowType } from "../../functions/core/components/actionRow.ts";
import { Menu } from "../../functions/core/index.ts";

declare global {
  export type TowerMenuOptions<T> = {
    /** Player associated with menu. */
    player: Player;
    /** Optional variables stored in the menu. */
    variables?: T;
    /** Boards. */
    boards: TowerBoard<T>[];
    /** Rows. */
    rows: TowerRow<T>[];
    /** Messages. */
    messages?: TowerMessage<T>[];
    /** Optionally attach menu to existing message. */
    botMessage?: Message;
    /** Optional function to run once menu is initialized. */
    onLoad?(m: Menu<T>): void;
    /** Optional function to run every time the menu is refreshed. */
    onRefresh?(m: Menu<T>): void;
  };

  export type TowerBoard<T> = {
    /** Name of the board. */
    name: string;
    /** Rows attached to the board. */
    rows: string[];
    /** Optional function to generate a new message when the board is loaded. */
    message?: string;
  };

  export type TowerRow<T> = {
    /** Name of the row. */
    name: string;
    /** What type of component does the row contain. */
    type: RowType;
    /** Function to get the components of the row. */
    components?(m: Menu<T>): Row | Promise<Row>;
  };

  export type TowerMessage<T> = {
    /** Name of message. */
    name: string;
    /** Function that returns message contents. */
    function(m: Menu<T>): Promise<MessageOptions>;
  };

  export type TowerMenu<T> = Menu<T>;
}
export {};
