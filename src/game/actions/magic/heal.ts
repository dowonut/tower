export default {
  name: "heal",
  type: "magic",
  description: "Heal yourself or one of your allies.",
  effects: [
    {
      type: "custom",
      targetMode: "allies",
      messages: ["PLAYER heals TARGET for STATUS"],
      async evaluate(args) {
        const { source } = args;

        for (let target of this.targets as Player[]) {
          target = await target.update({ health: { increment: 10 } });
        }

        return { players: this.targets as Player[] };
      },
    },
  ],
} satisfies ActionData;
