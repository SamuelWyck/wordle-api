const pool = require("./pool.js");



async function getUsedWords() {
    const {rows} = await pool.query("SELECT word from used_words;");
    return rows;
};

async function getLastUsedWord() {
    const {rows} = await pool.query("SELECT * from used_words ORDER BY date_used DESC LIMIT 1;");
    let wordInfo = null;
    if (rows.length !== 0) {
        wordInfo = rows[0];
    }
    return wordInfo;
};

async function insertUsedWord(word) {
    const {rows} = await pool.query(
        "INSERT INTO used_words (word) VALUES ($1) RETURNING *;",
        [word]
    );
    newWord = null;
    if (rows.length !== 0) {
        newWord = rows[0];
    }
    return newWord;
};

async function resetUsedWords() {
    await pool.query("DELETE FROM used_words;");
};

async function createWordleSession() {
    const {rows} = await pool.query("INSERT INTO wordle_games DEFAULT VALUES RETURNING *;");
    let session = null;
    if (rows.length !== 0) {
        session = rows[0];
    }
    return session;
};

async function getWordleSession(sessionId) {
    const {rows} = await pool.query("SELECT * FROM wordle_games WHERE id = $1", [sessionId]);
    let session = null;
    if (rows.length !== 0) {
        session = rows[0];
    }
    return session;
};

async function updateWordleSessionRemainingGuesses(sessionId, remainingGuesses) {
    const {rows} = await pool.query(
        "UPDATE wordle_games SET remaining_guesses = $1 WHERE id = $2 RETURNING *;", 
        [remainingGuesses, sessionId]
    );
    let session = null;
    if (rows.length !== 0) {
        session = rows[0];
    }
    return session;
};

async function getWordleSessionGuesses(sessionId) {
    const {rows} = await pool.query(
        "SELECT word FROM wordle_game_guesses WHERE game_id = $1 ORDER BY timestamp ASC;",
        [sessionId]
    );
    return rows;
};

async function insertWordleGuess(sessionId, word) {
    await pool.query(
        "INSERT INTO wordle_game_guesses (game_id, word) VALUES ($1, $2);",
        [sessionId, word]
    );
};

async function deleteOldWordleGames(currentDate) {
    await pool.query(
        "DELETE FROM wordle_games WHERE timestamp < $1;",
        [currentDate]
    );
};

async function getWordFromAllWords(word) {
    const {rows} = await pool.query("SELECT * FROM all_words WHERE word = $1", [word]);
    let wordInfo = null;
    if (rows.length !== 0) {
        wordInfo = rows[0];
    }
    return wordInfo;
};



module.exports = {
    getUsedWords,
    getLastUsedWord,
    insertUsedWord,
    resetUsedWords,
    createWordleSession,
    getWordleSession,
    updateWordleSessionRemainingGuesses,
    getWordleSessionGuesses,
    insertWordleGuess,
    deleteOldWordleGames,
    getWordFromAllWords
};