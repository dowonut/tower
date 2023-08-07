import { game } from "../../../tower.js";

/**
 * Format a variable for Discord embeds.
 */
export default function f(str: string | number) {
  if (typeof str == "string") str = game.titleCase(str);
  return `**\`${str}\`**`;
}
