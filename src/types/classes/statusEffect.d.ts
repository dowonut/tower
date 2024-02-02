import Prisma from "@prisma/client";
import { StatusEffectClass } from "../../game/_classes/statusEffects.js";
import { config } from "../../tower.ts";

declare global {
  type StatusEffectData = {
    name: string;
    description: string;
    /** When to evaluate the status effect. */
    evaluateOn: "turn_end" | "turn_start" | "immediate";
    /** All outcomes of the status effect. */
    outcomes: StatusEffectOutcome[];
    /** How long does the status effect lasts. */
    duration: number;
  };

  type StatusEffectOutcomeDefault<T> = {
    /** Type of effect. */
    type: T;
  };

  type StatusEffectOutcomeAll = {
    /** Information about stat change. */
    modifyStat: {
      stat: PlayerStat;
      type: "flat" | "multiplier";
    };
    /** Function to evaluate status effect. */
    evaluate?: (
      this: ActionEffect,
      args: { host: Enemy | Player }
    ) => Promise<{
      host?: Enemy | Player;
    }>;
    /** Damage dealt by the status effect. */
    damage: StatusEffectDamage | StatusEffectDamage[];
  };

  type StatusEffectOutcomeTypes = {
    damage: "damage";
    modify_stat: "modifyStat";
    custom: "evaluate";
  };

  /** Status effect damage. */
  export type StatusEffectDamage = {
    /** Damage type. */
    type: DamageType;
    /** Where to scale stats from. Default = host. */
    statSource?: "host" | "source";
    /** What type of scaling to use. Default = percent. */
    scaling?: "flat" | "percent";
    /** If scaling = "percent" then what stat does the action scale off. */
    source?: Stat;
    /** If scaling = "percent" then the base percent of source for scaling. */
    basePercent?: number;
    /** If scaling = "flat" then the base damage amount. */
    baseFlat?: number;
  };

  export type StatusEffectOutcome<T = StatusEffectOutcomeType> =
    T extends keyof StatusEffectOutcomeTypes
      ? StatusEffectOutcomeDefault<T> & Pick<StatusEffectOutcomeAll, StatusEffectOutcomeTypes[T]>
      : StatusEffectOutcomeDefault<T>;

  export type StatusEffectOutcomeType = keyof StatusEffectOutcomeTypes;

  export type StatusEffectBase = Prisma.StatusEffect & StatusEffectData;

  export type StatusEffect = StatusEffectClass;
}
export {};
