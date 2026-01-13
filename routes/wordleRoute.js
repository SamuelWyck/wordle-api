const {Router} = require("express");
const wordleController = require("../controllers/wordleController.js");
const {getWordleSession} = require("../utils/wordleSessionMiddleware.js");



const wordleRoute = Router();


wordleRoute.get("/guess/:word", getWordleSession, wordleController.wordGuessGet);
wordleRoute.get("/guesses", getWordleSession, wordleController.getPastWordleGuessesGet);



module.exports = wordleRoute;