const {Router} = require("express");
const wordleController = require("../controllers/wordleController.js");
const {getWordleSession} = require("../utils/wordleSessionMiddleware.js");



const wordleRoute = Router();


wordleRoute.get("/guess/:word", getWordleSession, wordleController.wordGuessGet);



module.exports = wordleRoute;