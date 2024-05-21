/**module.exports = (client) => {

    const activityOptions: ActivityOptions = {
        name: 'twitch.tv/greenstaresport',
        type: ActivityType.Watching,
      };
    
      // Définir la présence du bot
      client.user?.setPresence({
        status: 'online',
        activities: [activityOptions],
      }).then(() => console.log('Présence définie avec succès'))
        .catch(console.error);

};

const { ActivityType } = require("discord.js");
*/
