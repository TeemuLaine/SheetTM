const express = require("express");
const { updateCotdSheet, updateCotdInfo } = require("./controllers/sheetController");

const app = express();

app.use(express.json());

app.post("/cotd", async (req, res) => {
  const { player, date, div, rank } = req.body;

  if (!player || !date || !div || !rank) {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  try {
    const result = await updateCotdSheet(player, date, div, rank);
    res.json(result);
  } catch (error) {
    console.error("Error updating sheet: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/cotdinfo", async (req, res) => {
  const { track, type, date } = req.body;

  if (!track || !type || !date) {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  try {
    const result = await updateCotdInfo(track, type, date);
    res.json(result);
  } catch (error) {
    console.error("Error updating sheet: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("ok");
});

app.listen(8080, () => {
  console.log("Backend running on port 8080");
});
