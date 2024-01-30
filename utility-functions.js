const filePath = "data/userData.json";
const fs = require("fs").promises;

const getName = async (interaction) => {
  try {
    // Read the content of userData.json
    const fileData = await fs.readFile(filePath, "utf-8");

    // Parse the JSON content
    const userNames = JSON.parse(fileData);

    console.log(userNames)
    // Retrieve and reply with the user's name
    return userNames.find((user) => user.id === interaction.user.id);
  } catch (error) {
    console.error("Error reading data:", error.message);
    throw error; // Re-throw the error to handle it at a higher level if needed
  }
};

const setName = async (userId, newName) => {
  try {
    // Read existing data from the file
    const existingData = await fs.readFile(filePath, "utf-8");

    // Parse existing data or initialize an empty array
    const userNames = JSON.parse(existingData || "[]");

    // Update or add the user's name
    const existingUserIndex = userNames.findIndex((user) => user.id === userId);

    if (existingUserIndex !== -1) {
      userNames[existingUserIndex].name = newName;
    } else {
      userNames.push({ id: userId, name: newName });
    }

    // Write the updated data back to the file
    await fs.writeFile(filePath, JSON.stringify(userNames), "utf-8");
  } catch (error) {
    console.error("Error writing data:", error.message);
    throw error; // Re-throw the error to handle it at a higher level if needed
  }
};

const getColumnLetter = (index) =>  {
  let letter = '';
  while (index >= 0) {
    letter = String.fromCharCode(index % 26 + 65) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
}

module.exports = { getName, setName, getColumnLetter };
