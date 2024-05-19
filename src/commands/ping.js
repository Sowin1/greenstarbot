const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong"),
  run: ({ interaction, client, handler }) => {
    // Send a message to the guilds channel
    interaction.reply("Pong!");
  },
  options: {
    devOnly: true,
    userPermissions: ["Administrator"],
    //deleted: true,
  },
};
