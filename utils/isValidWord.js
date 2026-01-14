const db = require("../db/queries.js");

// async function isValidWord(word) {
//     const url = `${process.env.WORD_CHECK_API_URL}/${word}?key=${process.env.WORD_CHECK_API_KEY}`;
//     const res = await fetch(url);
//     const parsedRes = await res.json();

//     if (parsedRes.length === 0) {
//         return false;
//     }
//     const firstResult = parsedRes[0];
//     return typeof firstResult !== "string";
// };


async function isValidWord(word) {
    const wordInfo = await db.getWordFromAllWords(word);
    return wordInfo !== null;
};



module.exports = isValidWord;