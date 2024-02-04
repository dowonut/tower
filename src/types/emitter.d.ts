declare global {
  /** On player move. */
  export interface PlayerMoveEmitter {
    encounterId: number;
    player: Player;
    enemies?: Enemy[];
    players?: Player[];
  }

  /** On action message. */
  export interface ActionMessageEmitter {
    encounterId: number;
    message: string;
  }

  /** On player flee. */
  export interface PlayerFleeEmitter {
    encounterId: number;
    player: Player;
  }
}
export {};
