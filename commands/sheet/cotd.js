const { SlashCommandBuilder } = require("discord.js");
const { getName } = require("../../utility-functions");

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
        .setDescription("The date of the cotd (format: DD/MM)")
    ),

  async execute(interaction) {
    try {
      const user = await getName(interaction);
      const div = interaction.options.getInteger("division");
      const rank = interaction.options.getInteger("rank");
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
        await interaction.reply("Invalid date format.");
        return;
      }

      try {
        const data = {
          player: user.name,
          date: date,
          div: div,
          rank: rank,
        };

        const response = await fetch("http://localhost:8000/cotd", {
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

        const responseData = await response.json();
      } catch (error) {
        console.error("Error:", error);
      }

      await interaction.reply(
        `Updated ${user.name}'s cotd performance on ${date} to division ${div}, rank ${rank}`
      );
    } catch (error) {
      console.error("Error in execute:", error.message);
      await interaction.reply("An error occurred while executing the command.");
    }
  },
};
