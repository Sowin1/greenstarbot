const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 15,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Latence du bot'),
	async execute(interaction) {
		await interaction.reply(`Pong!`);
	},
};

//           .addField('Latency', `${ping}ms`, true)
// .addField('API Latency', `${interaction.client.ws.ping}ms`, true); // Include Discord API latency