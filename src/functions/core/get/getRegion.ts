import floors from "../../../game/_classes/floors.js";

export default function getRegion(player: Player, regionName: string) {
  let floor = floors[player.floor - 1];
  let region = floor.regions.find((x) => x.name == regionName.toLowerCase());
  return region;
}
