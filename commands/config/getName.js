const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs").promises;

const filePath = "data/userData.json";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getname")
    .setDescription("Gets your name for the sheet"),

  async execute(interaction) {
    try {
      // Read the content of userData.json
      const fileData = await fs.readFile(filePath, "utf-8");

      // Parse the JSON content
      const userNames = JSON.parse(fileData);

      // Retrieve and reply with the user's name
      const user = userNames.find((user) => user.id === interaction.user.id);

      if (user) {
        await interaction.reply(
          `Your name on the sheet is saved as ${user.name}.`
        );
      } else {
        await interaction.reply("Your name is not set yet. Use /setname to set it.");
      }
    } catch (error) {
      console.error("Error reading data:", error.message);
      await interaction.reply("An error occurred while retrieving your name.");
    }
  },
};
