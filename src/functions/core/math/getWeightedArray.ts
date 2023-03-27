import { game } from "../../../tower.js";

/**
 * Get random item from array of weights.
 */
export default function getWeightedArray<T>(
  array: { [key: string]: any; weight: number }[]
) {
  // Create options and weights
  let options = [];
  let weights = [];

  for (const item of array) {
    options.push(item);
    weights.push(item.weight);
  }

  // Get random output from weights
  let { item } = game.weightedRandom(options, weights);

  return item as T;
}
