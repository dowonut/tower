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

    enterCombat: async function (enemy) {
      // Update player to be in combat
      this.update({ inCombat: true, fighting: enemy.id });
    },

    exitCombat: async function () {
      // Update player to be in combat
      this.update({ fighting: null, inCombat: false });
    },

    getCurrentEnemy: async function () {
      const enemyInfo = await this.prisma.enemy.findUnique({
        where: { id: this.fighting },
      });
      const enemyType = enemies[enemyInfo.enemyType];

      const enemy = { ...enemyInfo, ...enemyType };

      return enemy;
    },

    updateEnemy: async function (update) {
      return await this.prisma.enemy.update({
        where: { id: this.fighting },
        data: update,
      });
    },
  },
};
