require("dotenv/config");
const { Client, GatewayIntentBits } = require("discord.js");
const { CommandKit } = require("commandkit");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

new CommandKit({
  client,
  devGuildIds: ["1238646014701867079"],
  devUserIds: ["375933463255056384"],
  commandsPath: `${__dirname}/commands`,
  eventsPath: `${__dirname}/events`,
  validationsPath: `${__dirname}/validations`,
  bulkRegister: true, // Delete an unused commands from discord
});

client.login(process.env.TOKEN);
