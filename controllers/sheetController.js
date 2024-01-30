const { google } = require("googleapis");
const { getColumnLetter } = require("../utility-functions");
const { spreadsheetId } = require("../config.json");

const updateCotdSheet = async (player, date, div, rank) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const range = "COTD!A1:AF";

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range,
  });

  const values = getRows.data.values;
  console.log(values[0]);

  let matchColumn;
  let matchRow;

  for (let column = 0; column < values[0].length; column++) {
    if (values[0][column] === player) {
      console.log(`Match for ${player} at column ${getColumnLetter(column)}`);
      matchColumn = getColumnLetter(column - 1);
      for (let row = 0; row < values.length; row++) {
        if (values[row][0] === date) {
          matchRow = row + 1;
          console.log(`Match for ${date} at row ${row + 1}`);
          break;
        }
      }
    }
  }
  if (matchColumn && matchRow) {
    const updateRange = `COTD!${matchColumn}${matchRow}`;

    googleSheets.spreadsheets.values.update({
      auth,
      spreadsheetId,
      range: updateRange,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[div, rank]],
      },
    });

    return values;
  } else {
    console.log("No matches");
    return;
  }
};

const updateCotdInfo = async (track, type, date) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const range = "COTD!A1:C";

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range,
  });

  const values = getRows.data.values;
  let matchRow;

  for (let row = 0; row < values.length; row++) {
    if (values[row][0] === date) {
      matchRow = row + 1;
      console.log(`Match for ${date} at row ${row + 1}`);
      break;
    }
  }

  if (matchRow) {
    const updateRange = `COTD!B${matchRow}:C${matchRow}`;

    googleSheets.spreadsheets.values.update({
      auth,
      spreadsheetId,
      range: updateRange,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[track, type]],
      },
    });

    return values;
  } else {
    console.log("No matches");
    return;
  }
};

module.exports = {
  updateCotdSheet,
  updateCotdInfo,
};
