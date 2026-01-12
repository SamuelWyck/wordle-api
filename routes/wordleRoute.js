const {Router} = require("express");
const wordleController = require("../controllers/wordleController.js");



const wordleRoute = Router();


wordleRoute.get("/guess/:word", wordleController.wordGuessGet);



module.exports = wordleRoute;