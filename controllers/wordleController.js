const asyncHandler = require("express-async-handler");
const {validationResult} = require("express-validator");
const {wordleWordGuessVal} = require("../utils/validator.js");
const isValidWord = require("../utils/isValidWord.js");
const wordManager = require("../utils/wordManager.js");



const wordGuessGet = asyncHandler(async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const word = req.params.word;
    const validWord = await isValidWord(word);
    if (!validWord) {
        return res.status(404).json({errors: [{msg: "Not a real English word."}]});
    }

    const score = await wordManager.testGuess(word);
    return res.json({score});
});



module.exports = {
    wordGuessGet: [
        wordleWordGuessVal,
        wordGuessGet
    ]
};