export default {
    name: "test",
    aliases: ["te"],
    arguments: "",
    description: "For testing purposes.",
    category: "admin",
    async execute(message, args, player, server) {
        const items = await player.getItems();
        console.log(items);
    },
};
