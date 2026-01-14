const express = require("express");
const cors = require("cors");
require("dotenv").config();
const utilRoute = require("./routes/utilRoute.js");
const wordleRoute = require("./routes/wordleRoute.js");



const app = express();

app.use(cors({
    exposedHeaders: process.env.SET_WORDLE_SESSION_HEADER
}));

app.get("/", function(req, res) {
    return res.json({msg: "hi"});
});

app.use("/util", utilRoute);
app.use("/wordle", wordleRoute);



const PORT = process.env.PORT;
app.listen(PORT, function() {
    console.log(`Sever running on port ${PORT}!`);
});