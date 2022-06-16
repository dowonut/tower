export default {
  name: "edit",
  aliases: ["ed"],
  permissions: ["ADMINISTRATOR"],
  async execute(message, args, prisma, config, player) {
    const argument = args.join(" ").split("$");

    let field = argument[1].trim().split(" ");

    const table = argument[0];
    const fieldEntry = field.shift();
    const fieldSearch = field.join(" ");

    console.log("TABLE:", table, "FIELD:", fieldEntry, "INPUT:", fieldSearch);

    const input = argument[2].trim().split(" ");
    const inputEntry = input.shift();
    const inputNew = input.join(" ");

    const newEntry = await prisma.player.update({
      where: { [fieldEntry]: { equals: fieldSearch, mode: "insensitive" } },
      data: {
        [inputEntry]: inputNew,
      },
    });

    message.reply(newEntry);
  },
};
