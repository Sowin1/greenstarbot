const { SlashCommandBuilder } = require("discord.js");
const { ReloadType } = require("commandkit");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Permet de relancer le bot | ⚠️ Prend plusieurs minutes"),
  run: async ({ interaction, client, handler }) => {
    // Send a message to the guilds channel
    await interaction.deferReply();
    await handler.reloadCommands("dev");
    interaction.reply({
      content: "Reloaded",
      ephemeral: true,
    });
  },
  options: {
    devOnly: true,
    userPermissions: ["Administrator"],
    //cooldown: "1d",
    //deleted: true,
  },
};
