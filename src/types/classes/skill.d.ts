import * as Prisma from "@prisma/client";
import { SkillClass } from "../../game/_classes/skills.ts";

declare global {
  export type SkillData = {
    name: string;
    /** Skill category. */
    category: "combat" | "crafting";
    /** If combat skill, which weapon type does it belong to. */
    weaponType?: WeaponType;
    /** Things to unlock as the skill levels up. */
    levels: SkillLevel[];
  };

  export type SkillLevel = {
    rewards: SkillReward[];
    info?: string;
  };

  type SkillReward = {
    /** The type of reward. */
    type: "unlockAction" | "addPassive";
    /** Name of the action to unlock. */
    action?: StaticActionName;
  };

  export type SkillBase = Prisma.Skill & SkillData;

  export type Skill = SkillClass;
}
export {};
