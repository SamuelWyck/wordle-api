const asyncHandler = require("express-async-handler");
const db = require("../db/queries.js");



const getWordleSession = asyncHandler(async function(req, res, next) {
    let session = null;
    let sessionId = req.headers["wordle-session-id"];

    try {
        session = await db.getWordleSession(sessionId);
    } catch {
        return res.status(500).json({errors: [{msg: "Server error"}]});
    }

    if (session === null) {
        try {
          session = await db.createWordleSession();
          sessionId = session.id;  
        } catch {
            return res.status(500).json({errors: [{msg: "Server error"}]});
        }
    }
    
    req.wordleSession = session;
    res.set("set-wordle-session-id", sessionId);
    next();
});



module.exports = {
    getWordleSession
};