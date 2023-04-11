import { game } from "../../../tower.js";

type MenuOptions<T> = TowerMenuOptions<T>;

const MenuBase = class<T> {
  constructor(args: MenuOptions<T>) {
    Object.assign(this, args);
  }
} as { new <T>(args: MenuOptions<T>): MenuOptions<T> };

/** testMenu */
export default class Menu<T> extends MenuBase<T> {
  botMessage?: Message;
  currentBoard?: string;

  constructor(object: MenuOptions<T>) {
    super(object);
  }

  //------------------------------------------------------------
  /** Initialise the board menu. */
  async init(boardName: string) {
    const board = this.boards[boardName];
    if (!board) return;
    this.currentBoard = boardName;
    if (board.message) {
      const messageOptions = await board.message(this);
      const { messageComponents, components } = await this.getComponents(board);
      this.botMessage = await game.send({
        message: this.message,
        ...messageOptions,
        components: messageComponents,
      });
      game.componentCollector(this.message, this.botMessage, components, this);
    } else throw new Error("Initial board must contain a message function.");
  }

  //------------------------------------------------------------
  /** Refresh the current board. */
  async refresh() {
    if (!this.currentBoard || !this.botMessage)
      throw new Error("Cannot refresh before initialized.");

    await this.switchBoard(this.currentBoard);
  }

  //------------------------------------------------------------
  /** Switch to a different board. */
  async switchBoard(boardName: string) {
    if (!this.currentBoard || !this.botMessage)
      throw new Error("Cannot switch board before initialized.");
    const board = this.boards[boardName];
    if (!board) return;
    this.currentBoard = boardName;

    let messageOptions: MessageOptions;
    if (board.message) {
      messageOptions = await board.message(this);
    }
    const { messageComponents, components } = await this.getComponents(board);
    this.botMessage.edit({ components: messageComponents, ...messageOptions });
    game.componentCollector(this.message, this.botMessage, components, this);
  }

  //------------------------------------------------------------
  /** Get all components from board. */
  async getComponents(board: TowerBoard<T>) {
    let components: Component[] = [];
    let messageComponents = [];
    for (const boardRow of board.rows) {
      let boardComponents = await boardRow.components(this);
      if (boardRow.type == "buttons") {
        // Format custom component presets.
        boardComponents = (boardComponents as Button[]).map((component) => {
          switch (component.id) {
            // Return button
            case "return":
              if (!component.board)
                throw new Error("Return component must include board name.");
              return {
                id: "return",
                emoji: "↩",
                board: component.board,
                //style: "primary",
                // function: async () => {
                //   this.switchBoard(component.board);
                // },
              };
            default:
              return component;
          }
        });
        components.push(...boardComponents);
      } else {
        components.push(boardComponents as SelectMenu);
      }
      const row = game.actionRow(boardRow.type, boardComponents);
      messageComponents.push(row);
    }
    return { messageComponents, components };
  }
}
