import { loadFiles } from "./_loadFiles.js";

class Recipe {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
  }
}

const recipes = await loadFiles("recipes", Recipe);

export default recipes;

// export default [
//   new Recipe({
//     name: "iron sword",
//     items: [{ name: "refined iron", quantity: 2 }, { name: "sword handle" }],
//     time: 5,
//     damage: { min: 2, max: 4 },
//   }),
//   new Recipe({
//     name: "sword handle",
//     items: [{ name: "stick" }, { name: "leather" }],
//     time: 5,
//   }),
// ];
