import { InteractionCollector } from "discord.js";
import { game } from "../../../tower.js";

type MenuOptions<T> = TowerMenuOptions<T>;

const MenuBase = class<T> {
  constructor(args: MenuOptions<T>) {
    Object.assign(this, args);
  }
} as { new <T>(args: MenuOptions<T>): MenuOptions<T> };

/** Menu class to handle complex Discord components. */
export default class Menu<T> extends MenuBase<T> {
  botMessage?: Message;
  currentBoard?: string;
  currentCollector?: InteractionCollector<any>;
  collectorArgs?: CollectorOptions;

  constructor(object: MenuOptions<T>) {
    super(object);
  }

  //------------------------------------------------------------
  /** Initialise the board menu. */
  async init(boardName: string, args: CollectorOptions = undefined) {
    if (args) {
      this.collectorArgs = args;
    }
    const board = this.boards.find((x) => x.name == boardName);
    if (!board) return;
    this.currentBoard = boardName;
    if (board.message) {
      const messageOptions = await this.getMessage(board).function(this);
      // const messageOptions = await board.message();
      const { messageComponents, components } = await this.getComponents(board);
      this.botMessage = await game.send({
        ...messageOptions,
        message: this?.message,
        channel: this?.channel,
        components: messageComponents,
      });
      this.createCollector(components);
    } else throw new Error("Initial board must contain a message function.");
    if (this.onLoad) this.onLoad(this);
  }

  //------------------------------------------------------------
  /** Refresh the current board. */
  async refresh(args: CollectorOptions = undefined) {
    if (!this.currentBoard || !this.botMessage) throw new Error("Cannot refresh before initialized.");

    await this.switchBoard(this.currentBoard, args);
  }

  //------------------------------------------------------------
  /** Switch to a different board. */
  async switchBoard(boardName: string, args: CollectorOptions = undefined) {
    if (args) {
      this.collectorArgs = args;
    }
    if (!this.currentBoard || !this.botMessage) throw new Error("Cannot switch board before initialized.");
    const board = this.boards.find((x) => x.name == boardName);
    if (!board) return;
    this.currentBoard = boardName;
    this.player = await this.player.refresh();

    let messageOptions: MessageOptions;
    if (board.message) {
      messageOptions = await this.getMessage(board).function(this);
      // messageOptions = await board.message();
    }
    const { messageComponents, components } = await this.getComponents(board);
    this.botMessage.edit({ ...messageOptions, components: messageComponents || [] });
    this.createCollector(components);
  }

  //------------------------------------------------------------
  /** Get all components from board. */
  async getComponents(board: TowerBoard<T>) {
    let components: Component[] = [];
    let messageComponents = [];
    for (const rowName of board.rows) {
      const boardRow = this.rows.find((x) => x.name == rowName);
      if (!boardRow) throw new Error("Not a valid row.");
      let boardComponents = await boardRow.components(this);
      if (boardRow.type == "buttons") {
        // Format custom component presets.
        boardComponents = (boardComponents as Button[]).map((component) => {
          switch (component.id) {
            // Return button
            case "return":
              if (!component.board) throw new Error("Return component must include board name.");
              return {
                id: "return",
                emoji: "↩",
                board: component.board,
                //style: "primary",
                // function: async () => {
                //   this.switchBoard(component.board);
                // },
                ...component,
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
    if (messageComponents.length < 1 || components.length < 1) return {};
    return { messageComponents, components };
  }

  //------------------------------------------------------------
  /** Get message components from board. */
  getMessage(board: TowerBoard<T>): TowerMessage<T> {
    const message = this.messages.find((x) => x.name == board.message);
    if (!message) return;
    return message;
  }

  //------------------------------------------------------------
  /** Create interaction collector. */
  async createCollector(components: Component[]) {
    const args = this.collectorArgs || undefined;
    if (this.currentCollector) {
      // console.log("> Stopping existing collector.");
      this.currentCollector.stop();
    }
    // console.log("> Creating new collector.");
    const collector = await game.componentCollector({
      message: this?.message,
      channel: this?.channel,
      reply: this.botMessage,
      components,
      menu: this,
      options: args,
    });
    this.currentCollector = collector;
  }
}
