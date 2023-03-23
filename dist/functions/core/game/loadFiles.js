import fs from "fs";
import path from "path";
export default async function loadFiles(folder, Class) {
    // Collect commands
    let files = [];
    function throughDirectory(directory, array) {
        fs.readdirSync(directory).forEach((file) => {
            const absolute = path.join(directory, file);
            if (fs.statSync(absolute).isDirectory())
                return throughDirectory(absolute, array);
            else
                return array.push(absolute);
        });
    }
    throughDirectory(`./src/game/${folder}`, files);
    let items = [];
    for (const file of files) {
        // Check if file is valid before continuing
        if ([".js", ".ts"].some((x) => file.endsWith(x)))
            continue;
        // Import file
        const { default: item } = await import(`../../../${file}`);
        // Check if file contains data
        if (!item)
            continue;
        // Check if file has a class
        let finalItem = item;
        if (item.class) {
            // Import class
            const { default: itemClass } = await import(`../enemyClasses/${item.class}.ts`);
            finalItem = { ...item, class: { ...itemClass } };
        }
        // Create final class and return
        items.push(new Class(finalItem));
    }
    return items;
}
