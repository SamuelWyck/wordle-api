const {DateTime} = require("luxon");
const asyncHandler = require("express-async-handler");
const db = require("../db/queries.js");



const getWordleSession = asyncHandler(async function(req, res, next) {
    let session = null;
    let sessionId = req.headers["wordle-session-id"];

    try {
        session = await db.getWordleSession(sessionId);
    } catch (error) {
        console.log(error);
        return res.status(500).json({errors: [{msg: "Server error"}]});
    }

    if (session === null) {
        try {
          session = await db.createWordleSession();
        } catch (error) {
            console.log(error);
            return res.status(500).json({errors: [{msg: "Server error"}]});
        }
    }
    
    session.id = session._id;
    delete session._id;
    sessionId = session.id;  
    req.wordleSession = session;
    res.set(process.env.SET_WORDLE_SESSION_HEADER, sessionId);
    next();
});



const deleteOldWordleSessions = asyncHandler(async function(req, res, next) {
    let currentDay = DateTime.local().setZone(process.env.TIMEZONE).startOf("day");
    currentDay = currentDay.toISO();
    currentDay = new Date(currentDay);

    try {
        await db.deleteOldWordleGames(currentDay);
    } catch (error) {
        console.log(error);
    }

    next();
});



module.exports = {
    getWordleSession,
    deleteOldWordleSessions
};