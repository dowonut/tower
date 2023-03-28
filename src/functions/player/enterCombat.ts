export default (async function (enemy: { id: number; [key: string]: any }) {
  await this.update({ inCombat: true, fighting: enemy.id });
} satisfies PlayerFunction);
