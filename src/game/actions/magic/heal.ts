export default {
  name: "heal",
  type: "magic",
  description: "Heal yourself or one of your allies.",
  outcomes: [
    {
      type: "apply_status",
      messages: [""],
      status: {
        name: "regenerating",
      },
    },
  ],
} as const satisfies ActionData;
