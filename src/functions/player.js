import enemies from "../game/enemies.js";

export default {
  player: {
    // Delete player
    erase: async function () {
      await this.prisma.player.delete({
        where: { id: this.id },
      });
    },

    // Update player
    update: async function (update) {
      return await this.prisma.player.update({
        where: { id: this.id },
        data: update,
      });
    },

    getCurrentEnemy: async function () {
      const enemyInfo = await this.prisma.enemy.findUnique({
        where: { id: this.fighting },
      });
      const enemyType = enemies[enemyInfo.enemyType];

      const enemy = { ...enemyInfo, ...enemyType };

      return enemy;
    },
  },
};
