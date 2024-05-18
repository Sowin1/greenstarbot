const {
  ActionRowBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

const games = require("");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("addevent")
    .setDescription("Permet d'ajouter un événement dans le planning de stream")
    .addStringOption((option) =>
      option
        .setName("nom")
        .setDescription("Définir le nom du tournoi")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Définir la description du tournoi")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("Définir la date du tournoi")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("lien")
        .setDescription("Définir le lien du tournoi")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("cast")
        .setDescription(
          "Devons-nous nous mettre en relation avec le tournoi pour le cast?"
        )
        .setRequired(true)
        .setChoices(
          { name: "Oui", value: "Oui" },
          { name: "Non", value: "Non" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("discord")
        .setDescription(
          "Le tournoi a-t-il un lien Discord ? | Laissez vide si non"
        )
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("heure")
        .setDescription("Définir l'heure du tournoi | Si brackets laissez vide")
        .setRequired(false)
    ),

  async execute(interaction) {
    const name = interaction.options.getString("nom");
    const desc = interaction.options.getString("description");
    const date = interaction.options.getString("date");
    const link = interaction.options.getString("lien");
    const cast = interaction.options.getString("cast");
    const lg = interaction.options.getString("discord") ?? "N/A";
    const hour = interaction.options.getString("heure") ?? "N/A";
    const choicecast = cast ? "Oui" : "Non";

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(interaction.id)
      .setPlaceholder("Sélectionnez un jeu")
      .addOptions(
        games.map((game) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(game.label)
            .setValue(game.value)
            .setEmoji(game.emoji)
            .setDescription(game.description)
        )
      );

    const actionRow = new ActionRowBuilder().addComponents(selectMenu);

    // Réponse initiale pour accuser réception
    await interaction.deferReply({ ephemeral: true });

    const reply = await interaction.editReply({
      content: "Veuillez sélectionner un jeu :",
      components: [actionRow],
      ephemeral: true,
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: (i) =>
        i.user.id === interaction.user.id && i.customId === interaction.id,
      time: 60_000,
    });

    collector.on("collect", async (i) => {
      if (!i.values.length) {
        await i.reply({
          content: "Vous n'avez pas sélectionné de jeux",
          ephemeral: true,
        });
        return;
      }

      // Name of game choose
      const selectedGames = i.values.map(
        (value) => games.find((game) => game.value === value).label
      );
      // Picture choose
      const selectedImages = i.values.map(
        (value) => games.find((game) => game.value === value).image
      );

      console.log(selectedGames);
      console.log(selectedImages);

      // Embed Builder
      const planningStream = new EmbedBuilder()
        .setColor(0x00ff83)
        .setTitle(`**${name}**`)
        .setURL("https://www.twitch.tv/greenstar_tv")
        .setAuthor({
          name: "Demande d'ajout d'un événement",
          iconURL: "https://i.imgur.com/cKxTHPf.png",
          url: "https://www.twitch.tv/greenstar_tv",
        })
        .setDescription("### Résumé de l'événement")
        .setThumbnail(
          "https://cdn.discordapp.com/icons/808260926591467531/2e6c0aa025a2460b14255e44fce4c483.webp?size=240"
        )
        .addFields(
          { name: "Description du tournois", value: `${desc}` },
          { name: "Nécessite une demande de cast ?", value: `${choicecast}` },
          { name: "Date du tournoi", value: `${date}` },
          { name: "Heure du tournoi", value: `${hour}` },

          { name: "Lien du tournoi", value: `${link}`, inline: true },
          { name: "Lien du discord", value: `${lg}`, inline: true }
        )
        .setImage(selectedImages.join(", "))
        .setTimestamp()
        .setFooter({
          text: "Made by Sowin with ❤️​ ",
          iconURL:
            "https://cdn.discordapp.com/avatars/375933463255056384/4b76fdbbef70debdb9385a0f14c5b767.webp?size=32",
        });

      // Confirmation create
      const confirm = new ButtonBuilder()
        .setCustomId("Validé")
        .setLabel("Validé la demande")
        .setStyle(ButtonStyle.Success);

      const cancel = new ButtonBuilder()
        .setCustomId("Annuler")
        .setLabel("Annulé la demande")
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder().addComponents(cancel, confirm);

      await i.update({
        embeds: [planningStream],
        ephemeral: true,
      });
    });

    collector.on("end", (collected) => {
      if (!collected.size) {
        interaction.editReply({
          content: "Temps écoulé, vous n'avez pas sélectionné de jeux.",
          ephemeral: true,
        });
      }
    });
  },
};
