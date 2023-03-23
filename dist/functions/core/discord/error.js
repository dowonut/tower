import * as config from "../../../config.js";
/**
 * Send error message to Discord.
 */
export default async function error(object) {
    if (!object.content || !object.message)
        return;
    const { content, message } = object;
    // Format reply contents
    const uContent = content.charAt(0).toUpperCase() + content.slice(1);
    const embed = {
        description: `:x: ${uContent}`,
        color: config.red,
    };
    const messageObject = {};
    messageObject.embeds = [embed];
    // if (boolean) {
    //   var messageRef = { embeds: [embed] };
    // } else {
    //   var messageRef = {
    //     content: `:x: **${message.author.username}**, ${content}`,
    //   };
    // }
    // if (!message.replied) return await message.reply(messageObject);
    // return await message.followUp(messageObject);
    return await message.reply(messageObject);
}
