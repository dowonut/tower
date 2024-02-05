import { game } from "../../../tower.js";

/** Convert a variable to an array. */
export default function toArray<T extends any | any[]>(variable: T | T[]) {
  return Array.isArray(variable) ? variable : ([variable] as T[]);
}
