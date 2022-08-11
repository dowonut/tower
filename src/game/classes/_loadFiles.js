import fs from "fs";
import path from "path";

export async function loadFiles(folder, Class) {
  // Collect commands
  let files = [];
  function throughDirectory(directory, array) {
    fs.readdirSync(directory).forEach((file) => {
      const absolute = path.join(directory, file);
      if (fs.statSync(absolute).isDirectory())
        return throughDirectory(absolute, array);
      else return array.push(absolute);
    });
  }
  throughDirectory(`./src/game/${folder}`, files);

  let items = [];
  for (const file of files) {
    const { default: item } = await import(`../../../${file}`);
    items.push(new Class(item));
  }

  return items;
}
