import { config, prisma } from "../../tower.js";
import {
  createClassFromType,
  getRandom,
  getWeightedArray,
  random,
} from "../../functions/core/index.js";
import { loadFiles } from "../../functions/core/game/loadFiles.js";
import _ from "lodash";
import { Prisma } from "@prisma/client";

const DungeonBaseClass = createClassFromType<DungeonBase>();

export class DungeonClass extends DungeonBaseClass {
  constructor(dungeon: Generic<DungeonBase>) {
    super(dungeon);
  }

  /** Update dungeon in database. */
  async update(args: Prisma.DungeonUncheckedUpdateInput | Prisma.DungeonUpdateInput) {
    const dungeonInfo = await prisma.dungeon.update({
      where: { id: this.id },
      data: args,
    });
    return Object.assign(this, dungeonInfo);
  }

  /** Get a random possible chamber based on weights. */
  getRandomWeightedChamber() {
    const chamber = getWeightedArray<{ id: number; weight: number }>(
      this.chambers.map((x) => ({ id: x.id, weight: x.weight }))
    );
    return this.chambers.find((x) => x.id == chamber.id);
  }

  /** Get a chamber by x and y position. */
  getChamber(x: number, y: number) {
    let id = this.structure[x - 1][y - 1];
    if (id == 0 || !id) return undefined;
    if (id == 10) return { ...this.bossChamber, type: "boss" } as DungeonChamberBoss;
    return this.chambers.find((x) => x.id == id);
  }

  /** Get number of adjacent chambers. */
  getAdjacentChambersCount(x: number, y: number) {
    let total = 0;
    if (this.getRelativeChamber("up", x, y)) total += 1;
    if (this.getRelativeChamber("down", x, y)) total += 1;
    if (this.getRelativeChamber("left", x, y)) total += 1;
    if (this.getRelativeChamber("right", x, y)) total += 1;
    return total;
  }

  /** Get the coordinates of adjacent valid chambers. */
  getAdjacentChambers(x: number, y: number) {
    const chambers: { x: number; y: number }[] = [];
    if (this.getRelativeChamber("up", x, y)) chambers.push({ x, y: y + 1 });
    if (this.getRelativeChamber("down", x, y)) chambers.push({ x, y: y - 1 });
    if (this.getRelativeChamber("left", x, y)) chambers.push({ x: x - 1, y });
    if (this.getRelativeChamber("right", x, y)) chambers.push({ x: x + 1, y });
    return chambers;
  }

  /** Get relative instance coordinates. */
  getRelativeCoords(direction: "up" | "down" | "left" | "right", x: number, y: number) {
    let coords = [1, 1];
    switch (direction) {
      case "up":
        coords = [x, Math.min(y + 1, 5)];
        break;
      case "down":
        coords = [x, Math.max(y - 1, 1)];
        break;
      case "left":
        coords = [Math.max(x - 1, 1), y];
        break;
      case "right":
        coords = [Math.min(x + 1, 8), y];
        break;
    }
    return { x: coords[0], y: coords[1] };
  }

  /** Get a chamber relative to another chamber. */
  getRelativeChamber(direction: "up" | "down" | "left" | "right", x: number, y: number) {
    let id: number;
    switch (direction) {
      case "up":
        id = this.structure[x - 1][Math.min(y - 1 + 1, 4)];
        break;
      case "down":
        id = this.structure[x - 1][Math.max(y - 1 - 1, 0)];
        break;
      case "left":
        id = this.structure[Math.max(x - 1 - 1, 0)][y - 1];
        break;
      case "right":
        id = this.structure[Math.min(x - 1 + 1, 7)][y - 1];
        break;
    }
    if (id == 0 || !id) return undefined;
    return this.chambers.find((x) => x.id == id);
  }

  /** Get a random direction. */
  getRandomDirection(x: number, y: number): "up" | "down" | "left" | "right" {
    let directions = ["up", "down", "left", "right"];
    const direction = getRandom(directions);
    return direction as any;
  }

  /** Get the coords of a random valid chamber. */
  getRandomChamber() {
    let coords: { x: number; y: number };
    while (!coords) {
      let randomX = random(1, 8);
      let randomY = random(1, 5);
      if (!this.getChamber(randomX, randomY)) continue;
      if (this.getAdjacentChambersCount(randomX, randomY) > 2) continue;
      coords = { x: randomX, y: randomY };
    }
    return coords;
  }

  /** Get the coords of a random empty tile that is adjacent to a filled tile. */
  getRandomEmptyTile() {
    let coords: { x: number; y: number };
    for (let i = 0; i < 100 && !coords; i++) {
      let randomX = random(1, 8);
      let randomY = random(1, 5);
      if (this.getChamber(randomX, randomY)) continue;
      if (this.getAdjacentChambersCount(randomX, randomY) > 2) continue;
      if (this.getAdjacentChambersCount(randomX, randomY) < 1) continue;
      coords = { x: randomX, y: randomY };
    }
    return coords;
  }

  /** Generate and save the dungeon's structure. */
  async generateStructure() {
    this.structure = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];

    // Define starting chamber
    this.structure[0][2] = this.getRandomWeightedChamber().id;
    let cc = { x: 1, y: 3 };

    // Decide coordinates for new chamber
    let nc = { x: 1, y: 3 };

    let doneGenerating = false;
    // Generate all paths
    for (let i = 0; i < 100 && !doneGenerating; i++) {
      // Get a random location to start path at
      if (i > 0) {
        cc = this.getRandomChamber();
      }
      let doneGeneratingPath = false;
      // Generate chambers along path
      for (let i = 0; i < 2 && !doneGeneratingPath; i++) {
        // Get new coordinates
        let foundNewCoords = false;
        for (let i = 0; i < 10 && !foundNewCoords; i++) {
          const direction = this.getRandomDirection(cc.x, cc.y);
          nc = this.getRelativeCoords(direction, cc.x, cc.y);
          // Check if coords are the same
          if (nc.x == cc.x && nc.y == cc.y) continue;
          // Check if a chamber already exists here
          if (this.getChamber(nc.x, nc.y)) continue;
          // Check if there is a chamber adjacent to the new coords
          if (this.getAdjacentChambersCount(nc.x, nc.y) > 1) continue;
          // Accept new coords
          foundNewCoords = true;
        }

        // Give up on path
        if (!foundNewCoords) {
          doneGeneratingPath = true;
          continue;
        }

        // Create boss chamber on final column
        if (nc.x == 8) {
          doneGeneratingPath = true;
          doneGenerating = true;
          this.structure[nc.x - 1][nc.y - 1] = 10;
          // Place random extra tiles
          let total = random(2, 4);
          for (let i = 0; i < total; i++) {
            const nc = this.getRandomEmptyTile();
            if (nc) this.structure[nc.x - 1][nc.y - 1] = this.getRandomWeightedChamber().id;
          }
          // Update in database
          await this.update({ structure: this.structure });
          continue;
        }

        // Define random chamber type
        this.structure[nc.x - 1][nc.y - 1] = this.getRandomWeightedChamber().id;

        // Update current coords
        cc = { x: nc.x, y: nc.y };
      }
    }
  }
}

const dungeons = await loadFiles<DungeonClass>("dungeons", DungeonClass);
export default dungeons;
