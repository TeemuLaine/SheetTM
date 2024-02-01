const { SlashCommandBuilder } = require("discord.js");
const { getName } = require("../../utility-functions");
const fetch = require("node-fetch");

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

      let success;

      const timeRegex = /^([0-5]?\d):([0-5]?\d)\.(\d{3})$/;
      const time = interaction.options.getString("time");

      if (!timeRegex.test(time)) {
        await interaction.reply("Invalid time format.");
        return;
      }

      if (!user) {
        await interaction.reply(
          "You haven't set your name yet. Please do /setname."
        );
        return;
      }

      try {
        const data = {
          player: user.name,
          track: track,
          time: time,
        };

        const response = await fetch("http://localhost:8080/campaign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.matchFound) {
          success = true;
        } else {
          success = false;
        }

        if (!response.ok) {
          // Log the error status and response text
          console.error(`Error: ${response.status} - ${await response.text()}`);
          return;
        }
      } catch (error) {
        console.error("Error:", error);
      }

      if (success) {
        await interaction.reply(
          `Updated ${user.name}'s time on track ${track} to ${time}`
        );
      } else {
        await interaction.reply(`Name not found on the sheet.`);
      }
    } catch (error) {
      console.error("Error in execute:", error.message);
      await interaction.reply("An error occurred while executing the command.");
    }
  },
};
