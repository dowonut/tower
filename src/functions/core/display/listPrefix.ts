import { game } from "../../../tower.js";

/** Get a prefix for an info list */
export default function listPrefix(index: number, array: any[]) {
  let prefix: string = "";
  if (index == array.length - 1 && array.length == 2) {
    prefix = ` and `;
  } else if (index == array.length - 1 && array.length > 1) {
    prefix = `, and `;
  } else if (index > 0) {
    prefix = ", ";
  }
  return prefix;
}
