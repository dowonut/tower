import { Recipe } from "@prisma/client";
import { RecipeClass } from "../../game/_classes/recipes.ts";

declare global {
  export type RecipeData = {
    name: string;
    /** Materials required to craft recipe. */
    items: { name: StaticItemName; quantity?: number }[];
    /** Time it takes to make in seconds. */
    time: number;
    /** Base damage if weapon. */
    damage?: { min: number; max: number };
  };

  export type Recipe = RecipeClass;
}
export {};
