import floors from "../../../game/_classes/floors.js";

export default function getRegion(player: Player, regionName: string) {
  let floor = floors[player.floor - 1];
  const region =
    floor.regions.find((x) => x.name == regionName.toLowerCase()) ||
    floor.regions.find((x) => x.aliases && x.aliases.includes(regionName.toLowerCase()));
  return region;
}
