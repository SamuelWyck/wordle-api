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



module.exports = {
    getUsedWords,
    getLastUsedWord,
    insertUsedWord,
    resetUsedWords
};