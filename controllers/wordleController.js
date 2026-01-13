const asyncHandler = require("express-async-handler");
const {validationResult} = require("express-validator");
const {wordleWordGuessVal} = require("../utils/validator.js");
const isValidWord = require("../utils/isValidWord.js");
const wordManager = require("../utils/wordManager.js");
const db = require("../db/queries.js");



const wordGuessGet = asyncHandler(async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    if (req.wordleSession.remaining_guesses === 0) {
        return res.status(404).json({errors: [{msg: "Out of guesses"}]});
    }
    const word = req.params.word;
    const validWord = await isValidWord(word);
    if (!validWord) {
        return res.status(404).json({errors: [{msg: "Not a real English word"}]});
    }

    const updatedGuesses = req.wordleSession.remaining_guesses - 1;
    let score = null;
    try {
        let [wordScore, _] = await Promise.all([
            wordManager.testGuess(word),
            db.updateWordleSessionGuesses(req.wordleSession.id, updatedGuesses)
        ]);
        score = wordScore;
    } catch {
        return res.status(500).json({errors: [{msg: "Server error"}]});
    }

    return res.json({score});
});



module.exports = {
    wordGuessGet: [
        wordleWordGuessVal,
        wordGuessGet
    ]
};