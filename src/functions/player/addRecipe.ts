import recipes from "../../game/_classes/recipes.js";
import { game, prisma } from "../../tower.js";

export default (async function (name: string) {
  const recipe = recipes.find((x) => x.name == name.toLowerCase());

  if (!recipe) throw new Error(`No recipe found by name ${name}`);

  const playerRecipe = await this.fetch<Recipe, string>({
    key: "recipe",
    name,
  });

  if (playerRecipe) return playerRecipe;

  return await prisma.recipe.create({
    data: { playerId: this.id, name: recipe.name },
  });
} satisfies PlayerFunction);
