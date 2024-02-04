import { game } from "../../../tower.js";
import fs from "fs";

/** Get image for a region. */
export default function getRegionImage(args: { name: string; returnPath?: boolean }) {
  const { name, returnPath = false } = args;

  let path = `./assets/character/backgrounds/${name.replaceAll(" ", "_").toLowerCase()}.png`;

  if (!fs.existsSync(path)) {
    // Get image file
    path = `./assets/character/backgrounds/default.png`;
  }

  if (returnPath) return path;
  return { attachment: path, name: "region.png" };
}
