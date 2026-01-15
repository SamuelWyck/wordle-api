const db = require("../db/queries.js");



async function isValidWord(word) {
    const wordInfo = await db.getWordFromAllWords(word);
    return wordInfo !== null;
};



module.exports = isValidWord;