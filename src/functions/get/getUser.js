// export default {
//   /** This is a cool function
//    * @global
//    * @constructor
//    * @param {object} object - Settings object.
//    * @param {string} [object.id] - User Discord id.
//    * @param {object} [object.message] - User Discord message.
//    *
//    * @return {object} User object.
//    */
//   getUser: async (object) => {
//     // Check if id provided
//     if (!object.message && !object.id)
//       return console.log("Must provide either message or id.");

//     const playerId = object.id ? object.id : object.message.author.id;

//     const user = await prisma.user.findUnique({
//       where: { discordId: playerId },
//     });
//     if (!user) return undefined;

//     return user;
//   },
// };

/** This is a cool function
 * @global
 * @constructor
 * @param {object} object - Settings object.
 * @param {string} [object.id] - User Discord id.
 * @param {object} [object.message] - User Discord message.
 *
 * @return {object} User object.
 */
export default async function getUser(object) {
  // Check if id provided
  if (!object.message && !object.id)
    return console.log("Must provide either message or id.");

  const playerId = object.id ? object.id : object.message.author.id;

  const user = await prisma.user.findUnique({
    where: { discordId: playerId },
  });
  if (!user) return undefined;

  return user;
}
