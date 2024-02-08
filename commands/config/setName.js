const { SlashCommandBuilder } = require("discord.js");
const { setName } = require("../../utility-functions");

const filePath = "data/userData.json";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setname")
    .setDescription("Sets your name for the sheet")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name you have on the sheet")
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const newName = interaction.options.getString("name");

    try {
      await interaction.deferReply();
      await setName(userId, newName);

      await interaction.editReply(`Set your name as ${newName}.`);
      console.info(
        `User ${interaction.user.username} (id: ${userId} set their name as ${newName})`
      );
    } catch (error) {
      console.error("Error updating data:", error.message);
      await interaction.editReply("An error occurred while setting your name.");
    }
  },
};
