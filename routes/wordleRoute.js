const {Router} = require("express");
const wordleController = require("../controllers/wordleController.js");
const {getWordleSession, deleteOldWordleSessions} = require("../utils/wordleSessionMiddleware.js");



const wordleRoute = Router();


wordleRoute.get("/guesses", deleteOldWordleSessions, getWordleSession, wordleController.getPastWordleGuessesGet);
wordleRoute.get("/guess/:word", getWordleSession, wordleController.wordGuessGet);



module.exports = wordleRoute;