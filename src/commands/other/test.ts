import { game, config, prisma, client } from "../../tower.js";

export default {
  name: "test",
  aliases: ["te"],
  description: "For testing purposes.",
  category: "admin",
  dev: true,
  async execute(message, args, player, server) {
    const gauge = 10000;
    let totalAV = 0;
    let players = [
      { id: "A", speed: 140, AV: getAV(140) },
      { id: "B", speed: 110, AV: getAV(110) },
      { id: "C", speed: 120, AV: getAV(120) },
      { id: "D", speed: 100, AV: getAV(100) },
      { id: "BOSS", speed: 200, AV: getAV(100) },
      // { id: "C", speed: 80, AV: getAV(80) },
      // { id: "D", speed: 70, AV: getAV(50) },
      // { id: "E", speed: 150, AV: getAV(150) },
    ];
    let goneTurn = {};
    const turns = 5;
    for (let i = 0; i < turns; ) {
      // Start new turn
      if (players.some((x) => x.AV == 0)) {
        let text = ``;
        for (const player of players) {
          text += `${player.id}: ${player.AV} - `;
        }
        console.log(`${players[0].id} goes! - ${text}`);
        players[0].AV = getAV(players[0].speed);
        goneTurn[players[0].id] = true;
        if (Object.keys(goneTurn).length == players.length) {
          goneTurn = {};
          console.log("New turn! -------------------------------------------");
          i++;
        }
        players = players.sort((a, b) => a.AV - b.AV);
      }
      // Evaluate turn
      else {
        players = players.sort((a, b) => a.AV - b.AV);
        const decreaseAV = players[0].AV;
        totalAV += decreaseAV;
        players.forEach((x) => (x.AV -= decreaseAV));
        // console.log(players);
      }
    }

    function getAV(speed: number) {
      return Math.floor(gauge / speed);
    }
  },
} as Command;
