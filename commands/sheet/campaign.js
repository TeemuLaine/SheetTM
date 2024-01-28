const { SlashCommandBuilder } = require("discord.js");
const { getName } = require("../../utility-functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("campaign")
    .setDescription("Edit your campaign time on the sheet")
    .addIntegerOption((option) =>
      option
        .setMinValue(1)
        .setMaxValue(25)
        .setName("track")
        .setDescription("Select track")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("Input your time in the example format: '0:12.345'")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const user = await getName(interaction);
      let track = interaction.options.getInteger("track");
      track = track < 10 ? `0${track}` : track.toString();

      const timeRegex = /^\d:\d{2}\.\d{3}$/;
      const time = interaction.options.getString("Time");

      if (!timeRegex.test(time)) {
        // The time format is incorrect
        await interaction.reply(
          "Invalid time format. Please use the format 'x:xx.xxx'"
        );
        return;
      }

      await interaction.reply(
        `Updated ${user.name}'s time on track ${track} to ${time}`
      );
    } catch (error) {
      console.error("Error in execute:", error.message);
      await interaction.reply("An error occurred while executing the command.");
    }
  },
};
