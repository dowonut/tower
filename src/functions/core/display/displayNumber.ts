import { game } from "../../../tower.js";

/** displayNumber */
export default function displayNumber(number: number) {
  switch (number) {
    default:
      return "1st";
    case 2:
      return "2nd";
    case 3:
      return "3rd";
    case 4:
      return "4th";
    case 5:
      return "5th";
  }
}
