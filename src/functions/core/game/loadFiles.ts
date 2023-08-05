import fs from "fs";
import path from "path";
import generic from "../../../game/_classes/generic.js";

export default async function loadFiles<Type>(folder: string, Class: new (name: Generic<Type>) => Type) {
  // Collect files
  let files = [];
  function throughDirectory(directory: string, array: any[]) {
    fs.readdirSync(directory).forEach((file) => {
      const absolute = path.join(directory, file);
      if (fs.statSync(absolute).isDirectory()) return throughDirectory(absolute, array);
      else return array.push(absolute);
    });
  }
  throughDirectory(`./src/game/${folder}`, files);

  let items: Type[] = [];
  for (const file of files) {
    // Check if file is valid before continuing
    if (![".js", ".ts"].some((x) => file.endsWith(x))) continue;
    // Import file
    const { default: item } = await import(`../../../../${file}`);
    // Check if file contains data
    if (!item) continue;
    // Check if file has a class
    let finalItem = { ...item, ...generic };

    if (Class.name == "EnemyClass") {
      // Import type
      try {
        const { default: itemType } = await import(`../../../game/enemyTypes/${item.type}.js`);
        finalItem = { ...finalItem, type: { ...itemType } };
      } catch (err) {
        console.error(err);
        continue;
      }
    }
    // Create final class and return
    items.push(new Class(finalItem));
  }

  return items;
}
