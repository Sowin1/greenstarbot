const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  cooldown: 15,
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Measures the bot\'s latency (round-trip time)'),
  async execute(interaction) {
    const startTime = Date.now(); // Capture the start time for latency calculation

    await interaction.reply({ content: 'Pinging...' }); // Send a temporary "Pinging..." message

    // Get the current time after sending the reply (realistic round-trip measurement)
    const message = await interaction.fetchReply();
    const endTime = Date.now();

    // Calculate the actual latency in milliseconds
    const latency = endTime - startTime;

    // Edit the original reply to show the latency
    await message.edit({ content: `Pong! Latency of bot and discord api: ${latency}ms` });
    
  },
};

