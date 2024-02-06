import { InteractionCollector } from "discord.js";
import { game } from "../../../tower.js";
import _ from "lodash";

type MenuOptions<T> = TowerMenuOptions<T>;

const MenuBase = class<T> {
  constructor(args: MenuOptions<T>) {
    Object.assign(this, args);
  }
} as { new <T>(args: MenuOptions<T>): MenuOptions<T> };

/** Menu class to handle complex Discord components. */
export default class Menu<T> extends MenuBase<T> {
  currentBoard?: string;
  currentCollector?: InteractionCollector<any>;
  collectorArgs?: CollectorOptions;

  constructor(object: MenuOptions<T>) {
    super(object);
  }

  //------------------------------------------------------------
  /** Initialise the board menu. */
  async init(boardName: (typeof this.boards)[number]["name"], args: CollectorOptions = undefined) {
    if (args) {
      this.collectorArgs = args;
    }
    if (!this.boards || !this.rows) {
      throw game.error({
        player: this.player,
        content: `Menu must contain one of both boards and rows before initialization.`,
      });
    }
    const board = this.boards.find((x) => x.name == boardName);
    if (!board) return;
    this.currentBoard = boardName;
    if (board.message) {
      const messageOptions = await this.getMessage(board).function(this);
      // const messageOptions = await board.message();
      const { messageComponents, components } = await this.getComponents(board);
      // console.log(JSON.stringify(messageComponents, null, 4));
      if (!this.botMessage) {
        this.botMessage = await game.send({
          ...messageOptions,
          player: this.player,
          components: messageComponents,
        });
      } else {
        this.botMessage = (await this.botMessage.edit({
          ...messageOptions,
          components: messageComponents,
        })) as Message;
      }
      this.createCollector(components);
    } else if (this.botMessage) {
      const { messageComponents, components } = await this.getComponents(board);
      this.botMessage = (await this.botMessage.edit({ components: messageComponents })) as Message;
      this.createCollector(components);
    } else throw new Error("Initial board must contain a message function.");
    if (this.onLoad) this.onLoad(this);
    return;
  }

  //------------------------------------------------------------
  /** Refresh the current board. */
  async refresh(args: CollectorOptions = undefined) {
    if (!this.currentBoard || !this.botMessage)
      throw new Error("Cannot refresh before initialized.");
    if (this.onRefresh) this.onRefresh(this);
    await this.switchBoard(this.currentBoard, args);
  }

  //------------------------------------------------------------
  /** Switch to a different board. */
  async switchBoard(boardName: string, args: CollectorOptions = undefined) {
    if (args) {
      this.collectorArgs = args;
    }
    if (!this.currentBoard || !this.botMessage)
      throw new Error("Cannot switch board before initialized.");
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
          if (component?.label?.length > 100)
            component.label = component.label.slice(0, 97) + "...";
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
      player: this.player,
      botMessage: this.botMessage,
      components,
      menu: this,
      options: args,
    });
    this.currentCollector = collector;
  }

  //------------------------------------------------------------
  /** Set boards. */
  async setBoards(boards: TowerBoard<T>[]) {
    this.boards = boards;
  }

  //------------------------------------------------------------
  /** Set rows. */
  async setRows(boards: TowerRow<T>[]) {
    this.rows = boards;
  }

  //------------------------------------------------------------
  /** Set messages. */
  async setMessages(boards: TowerMessage<T>[]) {
    this.messages = boards;
  }
}
