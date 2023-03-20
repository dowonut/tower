import { config } from "../../tower.js";

/**
 * Create a progress bar using text or emojis.
 * @param {number} min - Filled value.
 * @param {number} max - Total value.
 * @param {"health"|"xp"|"empty"} type - Type of progress bar to generate.
 * @param {number} [count] - How many characters to use for progress bar.
 * @returns {string}
 */
export default function progressBar(min, max, type, count) {
  // Set total boxes in progress bar
  const boxes = count || 10;
  // Get fill amount based on inputs
  let fill = Math.floor((min / max) * boxes);
  // Get icons
  const { bars } = config.emojis;
  let icons = {
    empty_left: "<□",
    empty_middle: "□",
    empty_right: "□>",
    left: "<■",
    middle: "■",
    right: "■>",
  };
  if (type) {
    icons.empty_left = bars.empty.left;
    icons.empty_middle = bars.empty.middle;
    icons.empty_right = bars.empty.right;
    icons.left = bars[type].left;
    icons.middle = bars[type].middle;
    icons.right = bars[type].right;
  }
  let text = ``;
  for (let i = 0; i < boxes; i++) {
    switch (true) {
      case i == 0 && i < fill:
        // Left end filled
        text += icons.left;
        break;
      case i == 0 && i >= fill:
        // Left end empty
        text += icons.empty_left;
        break;
      case i == boxes - 1 && i < fill:
        // Right end filled
        text += icons.right;
        break;
      case i == boxes - 1 && i >= fill:
        // Right end empty
        text += icons.empty_right;
        break;
      case i < fill:
        // Middle filled
        text += icons.middle;
        break;
      case i >= fill:
        // Middle empty
        text += icons.empty_middle;
        break;
    }
  }
  return text;
}
