const { SlashCommandBuilder } = require("discord.js");
const { getName } = require("../../utility-functions");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cotdinfo")
    .setDescription("Edit the info of the Track of the day on the sheet")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the track")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("The type of the track")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("The date of the cotd (format: MM/DD)")
    )
    .addIntegerOption((option) =>
      option
        .setName("playercount")
        .setDescription("The player count of the cup")
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply();
      const track = interaction.options.getString("name");
      const type = interaction.options.getString("type");
      const playerCount = interaction.options.getInteger("playercount");
      console.log(playerCount)
      let date = "";

      if (interaction.options.getString("date")) {
        const unformattedDate = interaction.options.getString("date");
        let [day, month] = unformattedDate.split("/");
        day = day.padStart(2, "0");
        month = month.padStart(2, "0");
        date = `${day}/${month}`;
      } else {
        const today = new Date();
        const day = today.getDate().toString().padStart(2, "0");
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        date = `${month}/${day}`;
      }

      const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/;
      if (!dateRegex.test(date)) {
        await interaction.editReply("Invalid date format.");
        return;
      }

      try {
        const data = {
          track: track,
          type: type,
          date: date,
          playerCount: playerCount,
        };

        const response = await fetch("http://localhost:8080/cotdinfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          // Log the error status and response text
          console.error(`Error: ${response.status} - ${await response.text()}`);
          return;
        }
      } catch (error) {
        console.error("Error:", error);
      }

      await interaction.editReply(
        `Updated the track of the day on ${date} to ${track}, of type ${type}`
      );
    } catch (error) {
      console.error("Error in execute:", error.message);
      await interaction.editReply(
        "An error occurred while executing the command."
      );
    }
  },
};
