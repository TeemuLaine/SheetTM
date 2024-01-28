const { SlashCommandBuilder } = require("discord.js");
const fs = require("node:fs");

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
      // Read existing data from the file
      const existingData = await fs.readFile(filePath, () => {
        console.log("Reading file");
      });

      // Parse existing data or initialize an empty array
      const userNames = JSON.parse(existingData || "[]");

      // Update or add the user's name
      const existingUserIndex = userNames.findIndex(
        (user) => user.id === userId
      );

      if (existingUserIndex !== -1) {
        userNames[existingUserIndex].name = newName;
      } else {
        userNames.push({ id: userId, name: newName });
      }

      // Write the updated data back to the file
      fs.writeFileSync(filePath, JSON.stringify(userNames));

      await interaction.reply(`Set your name as ${newName}.`);
    } catch (error) {
      console.error("Error updating data:", error.message);
      await interaction.reply("An error occurred while setting your name.");
    }
  },
};
