import { RowType } from "../../functions/core/components/actionRow.ts";
import { Menu } from "../../functions/core/index.ts";

declare global {
  export type TowerMenuOptions<T> = {
    message: Message;
    boards: { [name: string]: TowerBoard<T> };
    variables?: T;
  };

  export type TowerBoard<T> = {
    /** Rows attached to the board. */
    rows: {
      /** What type of component does the row contain. */
      type: RowType;
      /** Function to get the components of the row. */
      components?(m: Menu<T>): Row | Promise<Row>;
    }[];
    /** Optional function to generate a new message when the board is loaded. */
    message?(m: Menu<T>): Promise<MessageOptions>;
  };

  export type TowerMenu<T> = Menu<T>;
}
export {};
