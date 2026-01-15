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

app.use(function(req, res) {
    return res.status(404).json({errors: [{msg: "Page not found"}]});
});
app.use(function(error, req, res, next) {
    console.log(error);
    return res.status(500).json({errors: [{msg: "Server error"}]});
});


const PORT = process.env.PORT;
app.listen(PORT, function() {
    console.log(`Sever running on port ${PORT}!`);
});