const express = require("express");
require("dotenv").config();
const utilRoute = require("./routes/utilRoute.js");



const app = express();



app.get("/", function(req, res) {
    return res.json({msg: "hi"});
});

app.use("/util", utilRoute);



const PORT = process.env.PORT;
app.listen(PORT, function() {
    console.log(`Sever running on port ${PORT}!`);
});