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
        return res.status(400).json({errors: [{msg: "Out of guesses"}]});
    }
    const word = req.params.word;
    let validWord = null;
    try {
        validWord = await isValidWord(word);
    } catch (error) {
        console.log(error);
        return res.status(500).json({errors: [{msg: "Server error"}]});
    }
    if (!validWord) {
        return res.json({msg: "Word not in list", validWord: false});
    }

    const sessionId = req.wordleSession.id;
    let wordInfo = null;
    try {
        [wordInfo] = await Promise.all([
            wordManager.testGuess(word),
            db.insertWordleGuess(sessionId, word)
        ]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({errors: [{msg: "Server error"}]});
    }

    let [score, foundWord] = wordInfo;
    const updatedGuesses = (foundWord) ? 0 : req.wordleSession.remaining_guesses - 1;
    try {
        await db.updateWordleSessionRemainingGuesses(sessionId, updatedGuesses);
    } catch (error) {
        console.log(error);
        return res.status(500).json({errors: [{msg: "Server error"}]});
    }
    
    return res.json({score, validWord: true});
});



const getPastWordleGuessesGet = asyncHandler(async function(req, res) {
    const sessionId = req.wordleSession.id;
    let wordOfTheDay = null;
    let sessionGuesses = null;
    try {
        [wordOfTheDay, sessionGuesses] = await Promise.all([
            wordManager.getWordOfTheDay(),
            db.getWordleSessionGuesses(sessionId)
        ]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({errors: [{msg: "Server error"}]});
    }

    const guessScores = [];
    for (let guess of sessionGuesses) {
        const guessScore = wordManager.scoreWord(guess.word, wordOfTheDay);
        guessScores.push(guessScore);
    }

    return res.json({guessScores});
});



const getWordOfTheDayGet = asyncHandler(async function(req, res) {
    if (req.wordleSession.remaining_guesses > 0) {
        return res.status(403).json({errors: [{msg: "Game still in progress"}]});
    }

    const wordOfTheDay = await wordManager.getWordOfTheDay();
    return res.json({wordOfTheDay});
});



module.exports = {
    wordGuessGet: [
        wordleWordGuessVal,
        wordGuessGet
    ],
    getPastWordleGuessesGet,
    getWordOfTheDayGet
};