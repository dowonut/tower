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

  /** Get width of dungeon in tiles. */
  get width() {
    return this.structure.length;
  }

  /** Get height of dungeon in tiles. */
  get height() {
    return this.structure[0].length;
  }

  /** Update dungeon in database. */
  async update(args: Prisma.DungeonUncheckedUpdateInput | Prisma.DungeonUpdateInput) {
    const dungeonInfo = await prisma.dungeon.update({
      where: { id: this.id },
      data: args,
    });
    return Object.assign(this, dungeonInfo);
  }

  /** Refresh the dungeon with database data. */
  async refresh() {
    return Object.assign(this, await this.update({}));
  }

  /** Get a random possible chamber based on weights. */
  getRandomWeightedChamber() {
    const chamber = getWeightedArray<{ id: number; weight: number }>(
      this.chambers.map((x) => ({ id: x.id, weight: x.weight }))
    );
    return chamber;
  }

  /** Get a random chamber based on the type of chamber. */
  getRandomChamberByType(type: DungeonChamberType) {
    const chambers = this.chambers.filter((x) => x.type == type);
    if (_.isEmpty(chambers)) {
      return this.getRandomWeightedChamber();
    }
    const chamber = getWeightedArray<{ id: number; weight: number }>(
      chambers.map((x) => ({ id: x.id, weight: x.weight }))
    );
    return chamber;
  }

  /** Get a chamber by x and y position. */
  getChamber(x: number, y: number) {
    let id = this.structure?.[x - 1]?.[y - 1];
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
    if (this.getRelativeChamber("up", x, y)) chambers.push({ x, y: y - 1 });
    if (this.getRelativeChamber("down", x, y)) chambers.push({ x, y: y + 1 });
    if (this.getRelativeChamber("left", x, y)) chambers.push({ x: x - 1, y });
    if (this.getRelativeChamber("right", x, y)) chambers.push({ x: x + 1, y });
    return chambers;
  }

  /** Get relative instance coordinates. */
  getRelativeCoords(direction: "up" | "down" | "left" | "right", x: number, y: number) {
    let coords = [1, 1];
    switch (direction) {
      case "up":
        coords = [x, Math.max(y - 1, 1)];
        break;
      case "down":
        coords = [x, Math.min(y + 1, this.height)];
        break;
      case "left":
        coords = [Math.max(x - 1, 1), y];
        break;
      case "right":
        coords = [Math.min(x + 1, this.width), y];
        break;
    }
    return { x: coords[0], y: coords[1] };
  }

  /** Get a chamber relative to another chamber. */
  getRelativeChamber(direction: "up" | "down" | "left" | "right", x: number, y: number) {
    let id: number;
    switch (direction) {
      case "up":
        id = this.structure?.[x - 1]?.[y - 1 - 1];
        break;
      case "down":
        id = this.structure?.[x - 1]?.[y - 1 + 1];
        break;
      case "left":
        id = this.structure?.[x - 1 - 1]?.[y - 1];
        break;
      case "right":
        id = this.structure?.[x - 1 + 1]?.[y - 1];
        break;
    }
    if (id == 0 || !id) return undefined;
    if (id == 10) return { ...this.bossChamber, type: "boss" } as DungeonChamberBoss;
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
    const tiles = this.getTilesByCondition((x, y) => {
      if (!this.getChamber(x, y)) return false;
      if (this.getAdjacentChambersCount(x, y) > 2) return false;
      return true;
    });
    return getRandom(tiles);
  }

  /** Get the coords of a random empty tile that is adjacent to a filled tile. */
  getRandomEmptyTile(adjacentCount = 2) {
    const tiles = this.getTilesByCondition((x, y) => {
      if (this.getChamber(x, y)) return false;
      if (this.getAdjacentChambersCount(x, y) !== adjacentCount) return false;
      return true;
    });
    return getRandom(tiles);
  }

  /** Get the coords of a random empty tile that has 2 opposite adjacent tiles. */
  getRandomBridgeTile() {
    const tiles = this.getTilesByCondition((x, y) => {
      if (this.getChamber(x, y)) return false;
      if (this.getAdjacentChambersCount(x, y) !== 2) return false;
      if (
        (this.getRelativeChamber("up", x, y) && this.getRelativeChamber("down", x, y)) ||
        (this.getRelativeChamber("left", x, y) && this.getRelativeChamber("right", x, y))
      ) {
        return true;
      } else {
        return false;
      }
    });
    return getRandom(tiles);
  }

  /** Get a list of tiles that satisfy a condition. */
  getTilesByCondition(condition: (x: number, y: number) => Boolean) {
    let tiles: { x: number; y: number }[] = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (condition(x + 1, y + 1)) {
          tiles.push({ x: x + 1, y: y + 1 });
        } else {
          continue;
        }
      }
    }
    return tiles;
  }

  /** Generate and save the dungeon's structure. */
  async generateStructure(x = 8, y = 5) {
    this.structure = Array.from({ length: x }, () => Array(y).fill(0));

    // Define starting chamber
    const startingY = Math.floor(y / 2) + 1;
    this.structure[0][startingY - 1] = this.getRandomChamberByType("respite").id;
    let cc = { x: 1, y: startingY };

    // Parameters that scale with size
    const pathLength = Math.floor((x + y) / 4);

    // Decide coordinates for new chamber
    let nc = { x: 1, y: startingY };

    let doneGenerating = false;
    // Generate all paths
    for (let i = 0; i < 1000 && !doneGenerating; i++) {
      // Get a random location to start path at
      if (i > 0) {
        cc = this.getRandomChamber();
      }
      let doneGeneratingPath = false;
      // Generate chambers along path
      for (let i = 0; i < pathLength && !doneGeneratingPath; i++) {
        // Get new coordinates
        let foundNewCoords = false;
        for (let i = 0; i < 10 && !foundNewCoords; i++) {
          const direction = this.getRandomDirection(cc.x, cc.y);
          nc = this.getRelativeCoords(direction, cc.x, cc.y);
          // Check if coords are within dimensions of dungeon
          if (nc.x > x || nc.y > y || nc.x < 1 || nc.y < 1) continue;
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
        if (nc.x == x) {
          doneGeneratingPath = true;
          doneGenerating = true;
          this.structure[nc.x - 1][nc.y - 1] = 10;
          // Determine number of extra tiles to place
          let total = random(pathLength - 1, pathLength + 1);
          // Place tiles adjacent to isolated tiles
          for (let i = 0; i < total; i++) {
            const nc = this.getRandomEmptyTile(1);
            if (nc) this.structure[nc.x - 1][nc.y - 1] = this.getRandomWeightedChamber().id;
          }
          // Places bridge tiles
          for (let i = 0; i < total; i++) {
            const nc = this.getRandomBridgeTile();
            if (nc) this.structure[nc.x - 1][nc.y - 1] = this.getRandomWeightedChamber().id;
          }
          // Locate isolated tiles
          const isolatedTiles = this.getTilesByCondition((x, y) => {
            if (this.getAdjacentChambersCount(x, y) > 1) return false;
            if (this.getChamber(x, y) == undefined) return false;
            if (x == 1 && y == startingY) return false;
            if (x == nc.x && y == nc.y) return false;
            return true;
          });
          // console.log("> Isolated tiles: ", isolatedTiles);
          // Update in database
          await this.update({
            structure: this.structure,
            x: 1,
            y: startingY,
            discoveredTiles: [...this.getAdjacentChambers(1, startingY), { x: 1, y: startingY }],
          });
          continue;
        }
        // Place normal tile
        else {
          // Define random chamber type
          this.structure[nc.x - 1][nc.y - 1] = this.getRandomWeightedChamber().id;

          // Update current coords
          cc = { x: nc.x, y: nc.y };
        }
      }
    }

    if (!doneGenerating) {
      console.log("> Failed to generate dungeon structure.");
    }
  }
}

const dungeons = await loadFiles<DungeonClass>("dungeons", DungeonClass);
export default dungeons;
