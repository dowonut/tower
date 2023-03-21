/**
 * Object representing a Discord command.
 * @typedef {Object} Command
 * @property {string} name - Name of the command.
 * @property {string} description - Description of the command.
 * @property {string[]} [aliases] - Aliases of the command.
 * @property {string} [arguments] - Arguments for the command.
 * @property {"general"|"player"|"location"|"items"|"crafting"|"combat"|"settings"|"other"|"admin"} [category] - Category the command belongs to.
 * @property {string} [cooldown] - Command cooldown.
 * @property {boolean} [admin=false] - The command is exclusive to admins.
 * @property {boolean} [needChar=true] - A character is required to run the command.
 * @property {boolean} [useInCombatOnly=false] - The command can only be used in combat.
 * @property {boolean} [useInCombat=false] - The command can be used in combat.
 * @property {boolean} [ignoreInHelp=false] - Ignore the command in the help menu.
 * @property {Execute} execute - The main function of the object
 */

/**
 * Main function of a Discord command object.
 * @callback Execute
 * @param {object} message - Discord message object.
 * @param {array} args - Command arguments.
 * @param {PlayerObject} player - Player object.
 * @param {object} server - Server object.
 * @returns Nothing
 */

/**
 * Player object.
 * @typedef {typeof import('./functions/_player.js').default} PlayerObject
 */

/**
 * Component button.
 * @typedef {object} ComponentButton
 * @property {string} id - Button id.
 * @property {string} [label] - Button label.
 * @property {string} [emoji] - Button emoji.
 * @property {boolean} [disable] - The button is disabled and not clickable.
 * @property {string} [url] - URL for link button.
 * @property {boolean} [stop] - Pressing the button stops the collector.
 * @property {function} function - Function to run when the button is pressed.
 * @property {"primary"|"secondary"|"success"|"danger"|"link"} [style] - Button style.
 */

/**
 * Select menu object.
 * @typedef {object} SelectMenu
 * @property {string} id - Select menu id.
 * @property {string} placeholder - Default text to show.
 * @property {SelectMenuOption[]} options - Select menu options.
 * @property {function} function - Function to run when option is selected.
 */

/**
 * Select menu option.
 * @typedef {object} SelectMenuOption
 * @property {string} label - Option label.
 * @property {string} value - Option value.
 * @property {string} description - Option description.
 */
