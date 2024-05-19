/* const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong"),
  run: async ({ interaction, client, handler }) => {
    // Send a message to the guilds channel
    interaction.deferReply();
    await handler.reloadCommands();
    interaction.followUp("Reloaded");
    interaction.reply("Pong!");
  },
  options: {
    devOnly: true,
    userPermissions: ["Administrator"],
    //cooldown: "1d",
    //deleted: true,
  },
};
 */
