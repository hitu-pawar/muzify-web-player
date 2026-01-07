const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Static files (HTML, CSS, JS, MP3)
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});
