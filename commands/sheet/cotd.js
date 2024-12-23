const { SlashCommandBuilder } = require("discord.js");
const { getName } = require("../../utility-functions");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cotd")
    .setDescription("Edit your cup of the day position on the sheet")
    .addIntegerOption((option) =>
      option
        .setMinValue(1)
        .setName("division")
        .setDescription("Your division")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setMinValue(1)
        .setMaxValue(64)
        .setName("rank")
        .setDescription("Your knockout rank")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("The date of the cotd (format: MM/DD/YY)")
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply();
      const user = await getName(interaction);
      const div = interaction.options.getInteger("division");
      const rank = interaction.options.getInteger("rank");
      let date = "";

      let success;
      let newEntry;

      if (interaction.options.getString("date")) {
        const unformattedDate = interaction.options.getString("date");
        let [day, month, year] = unformattedDate.split("/");
        day = day.padStart(2, "0");
        month = month.padStart(2, "0");
        date = `${day}/${month}/${year}`;
      } else {
        const today = new Date();
        const day = today.getDate().toString().padStart(2, "0");
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const year = today.getFullYear().toString();
        date = `${month}/${day}/${year}`;
      }

      const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
      if (!dateRegex.test(date)) {
        await interaction.editReply("Invalid date format.");
        return;
      }

      if (!user) {
        await interaction.editReply(
          "You haven't set your name yet. Please do /setname."
        );
        return;
      }

      try {
        const data = {
          player: user.name,
          date: date,
          div: div,
          rank: rank,
        };

        const response = await fetch("http://localhost:8080/cotd", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          console.error(`Error: ${response.status} - ${await response.text()}`);
          await interaction.editReply(
            "An error occurred while updating data on the sheet."
          );
          return;
        }

        const result = await response.json();

        if (result.matchFound) {
          success = true;
        } else {
          success = false;
        }
        newEntry = result.newEntry;
      } catch (error) {
        console.error("Error fetching data:", error);
        await interaction.editReply("An error occurred while fetching data.");
        return;
      }

      if (success) {
        if (newEntry) {
          await interaction.editReply(
            `Updated ${user.name}'s cotd performance on ${date} to division ${div}, rank ${rank} - **New COTDigami entry!**`
          );
        } else {
          await interaction.editReply(
            `Updated ${user.name}'s cotd performance on ${date} to division ${div}, rank ${rank}`
          );
        }
      } else {
        await interaction.editReply(`Name not found on the sheet.`);
      }
    } catch (error) {
      console.error("Error in execute:", error);
      await interaction.editReply(
        "An error occurred while executing the command."
      );
    }
  },
};
