const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lb")
    .setDescription("Gets the current campaign leaderboard"),

  async execute(interaction) {
    let lbString = "";
    try {
      await interaction.deferReply();

      try {
        const response = await fetch("http://localhost:8080/lb");

        const result = await response.json();
        for (let i = 0; i < result.length; i++) {
          lbString += `#${i + 1}: ${result[i].name} - **${result[i].score}**\n`;
        }
      } catch (error) {
        console.error(error);
      }
      await interaction.editReply(lbString);
    } catch (error) {
      console.error("Error reading data:", error.message);
      await interaction.editReply(
        "An error occurred while retrieving your name."
      );
    }
  },
};
