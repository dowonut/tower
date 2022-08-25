import floors from "../../game/classes/floors.js";

export default {
  getRegion: (player, regionName) => {
    let floor = floors[player.floor - 1];

    let region = floor.regions.find((x) => x.name == regionName.toLowerCase());

    return region;
  },
};
