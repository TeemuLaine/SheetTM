const express = require("express");
const { updateSheet } = require("./controllers/sheetController");

const app = express();

app.use(express.json());

app.post("/cotd", async (req, res) => {
  const { player, date, div, rank } = req.body;

  if (!player || !date || !div || !rank) {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  try {
    const result = await updateSheet(player, date, div, rank);
    res.json(result);
  } catch (error) {
    console.error("Error updating sheet: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req,res) => {
  res.send("ok")
})

app.listen(8080, () => {
  console.log("Backend running on port 8080");
});
