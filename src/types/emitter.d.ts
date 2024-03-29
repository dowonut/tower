declare global {
  /** On player finish action. */
  export interface PlayerActionCompleteEmitter {
    encounterId: number;
    player: Player;
    enemies?: Enemy[];
    players?: Player[];
  }

  /** On action message. */
  export interface ActionMessageEmitter {
    encounterId: number;
    message: string;
    data?: { statusEffect?: StatusEffect; damage?: EvaluatedDamage };
  }

  /** On player flee. */
  export interface PlayerFleeEmitter {
    encounterId: number;
    player: Player;
  }

  /** On player initiate action. */
  export interface PlayerActionEmitter {
    encounterId: number;
    player: Player;
  }

  /** On player moving inside dungeon. */
  export interface DungeonActionEmitter {
    action: "move_chamber" | "enter_chamber" | "exit_chamber";
    dungeon: Dungeon;
  }
}
export {};
