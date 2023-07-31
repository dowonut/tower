import { config } from "../../../tower.js";

/**
 * Create a progress bar using text or emojis.
 */
export default function progressBar(args: {
  min: number;
  /** Display difference based on previous value. */
  minPrevious?: number;
  max: number;
  type: ProgressBarColor;
  count?: number;
}): string {
  const { min, max, type, count, minPrevious } = args;
  let fillDifference = 0;

  // Set total boxes in progress bar
  const boxes = count || 10;
  // Get fill amount based on inputs
  let fill = Math.floor((min / max) * boxes);
  // Get difference fill amount
  if (minPrevious) {
    fillDifference = Math.floor((minPrevious / max) * boxes);
  }
  // Get icons
  const { bars } = config.emojis;
  let icons = {
    empty_left: "<□",
    empty_middle: "□",
    empty_right: "□>",
    white_left: "",
    white_middle: "",
    white_right: "",
    left: "<■",
    middle: "■",
    right: "■>",
  };
  if (type) {
    icons.empty_left = bars.empty.left;
    icons.empty_middle = bars.empty.middle;
    icons.empty_right = bars.empty.right;
    icons.white_left = bars.white.left;
    icons.white_middle = bars.white.middle;
    icons.white_right = bars.white.right;
    icons.left = bars[type].left;
    icons.middle = bars[type].middle;
    icons.right = bars[type].right;
  }
  let text = ``;
  for (let i = 0; i < boxes; i++) {
    switch (true) {
      // Left end ----------------------------------------
      case i == 0 && i < fill:
        // Left end filled
        text += icons.left;
        break;
      case i == 0 && i >= fill && i < fillDifference:
        // Left end white
        text += icons.white_left;
        break;
      case i == 0 && i >= fill && i >= fillDifference:
        // Left end empty
        text += icons.empty_left;
        break;
      // Right end ----------------------------------------
      case i == boxes - 1 && i < fill:
        // Right end filled
        text += icons.right;
        break;
      case i == boxes - 1 && i >= fill && i < fillDifference:
        // Right end white
        text += icons.white_right;
        break;
      case i == boxes - 1 && i >= fill && i >= fillDifference:
        // Right end empty
        text += icons.empty_right;
        break;
      // Middle ----------------------------------------
      case i < fill:
        // Middle filled
        text += icons.middle;
        break;
      case i >= fill && i < fillDifference:
        // Right end white
        text += icons.white_middle;
        break;
      case i >= fill && i >= fillDifference:
        // Middle empty
        text += icons.empty_middle;
        break;
    }
  }
  return text;
}
