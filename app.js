const express = require("express");
require("dotenv").config();



const app = express();



app.get("/", function(req, res) {
    return res.json({msg: "hi"});
});



const PORT = process.env.PORT;
app.listen(PORT, function() {
    console.log(`Sever running on port ${PORT}!`);
});