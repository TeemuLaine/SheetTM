const { SlashCommandBuilder } = require("discord.js");
const {getName} = require("../../utility-functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getname")
    .setDescription("Gets your name for the sheet"),

  async execute(interaction) {
    try {
      const user = await getName(interaction);
      if (user) {
        await interaction.reply(
          `Your name on the sheet is saved as ${user.name}.`
        );
      } else {
        await interaction.reply(
          "Your name is not set yet. Use /setname to set it."
        );
      }
    } catch (error) {
      console.error("Error reading data:", error.message);
      await interaction.reply("An error occurred while retrieving your name.");
    }
  },
};
