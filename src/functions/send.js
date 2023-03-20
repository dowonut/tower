import { config } from "../tower.js";

/**
 * Send a messsage to Discord.
 * @param {object} object
 * @param {object} [object.message] - Message object.
 * @param {object} [object.channel] - Channel object.
 * @param {string} [object.content] - Regular message content.
 * @param {object[]} [object.embeds] - Message embeds.
 * @param {object[]} [object.components] - Message components.
 * @param {boolean} [object.ping=false] - Whether or not to ping the user.
 */
export default async function send(object) {
  const channel = object.message ? object.message.channel : object.channel;
  if (!object.ping) object.ping = false;

  let messageObject = {
    content: "",
  };

  if (object.content) messageObject.content = object.content;
  if (object.components) messageObject.components = object.components;
  if (object.embeds) {
    messageObject.embeds = object.embeds;

    for (let i = 0; i < messageObject.embeds.length; i++) {
      if (!messageObject.embeds[i].color) {
        messageObject.embeds[i].color = config.botColor;
      }
    }
  }
  if (object.ping && object.message) {
    messageObject.content =
      `<@${object.message.author.id}> ` + messageObject.content;
  }

  const botMsg = await channel.send(messageObject);

  return botMsg;
}
