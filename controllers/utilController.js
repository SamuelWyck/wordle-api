const asyncHandler = require("express-async-handler");



const serverPing = asyncHandler(async function(req, res) {
    return res.json({msg: "server listening"});
});



module.exports = {
    serverPing
};