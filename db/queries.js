const pool = require("./pool.js");
const {ObjectId} = require("mongodb");



async function getUsedWords() {
    // const {rows} = await pool.query("SELECT word from used_words;");
    const rows = await pool.collection("used_words").find({}, {word: 1, _id: 0, timestamp: 0}).toArray();
    return rows;
};

async function getLastUsedWord() {
    // const {rows} = await pool.query("SELECT * from used_words ORDER BY date_used DESC LIMIT 1;");
    const rows = await pool.collection("used_words").find({}).sort({timestamp: -1}).limit(1).toArray();
    let wordInfo = null;
    if (rows.length !== 0) {
        wordInfo = rows[0];
    }
    return wordInfo;
};

async function insertUsedWord(word) {
    // const {rows} = await pool.query(
    //     "INSERT INTO used_words (word) VALUES ($1) RETURNING *;",
    //     [word]
    // );
    // newWord = null;
    // if (rows.length !== 0) {
    //     newWord = rows[0];
    // }
    // return newWord;
    const row = await pool.collection("used_words").findOneAndUpdate({word: "aaaaaa"}, {
        $set: {word: word, date_used: new Date(Date.now())}
    }, {upsert: true, returnDocument: "after"});
    newWord = null;
    if (row) {
        newWord = row;
    }
    return newWord;
};

async function resetUsedWords() {
    // await pool.query("DELETE FROM used_words;");
    await pool.collection("used_words").deleteMany();
};

async function createWordleSession() {
    // const {rows} = await pool.query("INSERT INTO wordle_games DEFAULT VALUES RETURNING *;");
    // let session = null;
    // if (rows.length !== 0) {
    //     session = rows[0];
    // }
    // return session;
    const row = await pool.collection("wordle_games").findOneAndUpdate({remaining_guesses: -1},{
        $set:{remaining_guesses: 6, timestamp: new Date(Date.now()), guesses: []}
    }, {returnDocument: "after", upsert: true});
    let session = null;
    if (row) {
        session = row;
    }
    return session;
};

async function getWordleSession(sessionId) {
    // const {rows} = await pool.query("SELECT * FROM wordle_games WHERE id = $1", [sessionId]);
    // let session = null;
    // if (rows.length !== 0) {
    //     session = rows[0];
    // }
    // return session;
    const row = await pool.collection("wordle_games").findOne({_id: new ObjectId(sessionId)}, {guesses: 0});
    let session = null;
    if (row) {
        session = row;
    }
    return session;
};

async function updateWordleSessionRemainingGuesses(sessionId, remainingGuesses) {
    // const {rows} = await pool.query(
    //     "UPDATE wordle_games SET remaining_guesses = $1 WHERE id = $2 RETURNING *;", 
    //     [remainingGuesses, sessionId]
    // );
    // let session = null;
    // if (rows.length !== 0) {
    //     session = rows[0];
    // }
    // return session;
    const row = await pool.collection("wordle_games").findOneAndUpdate({_id: new ObjectId(sessionId)}, {
        $set: {remaining_guesses: remainingGuesses}
    }, {returnDocument: "after"});
    let session = null;
    if (row) {
        session = row;
    }
    return session;
};

async function getWordleSessionGuesses(sessionId) {
    // const {rows} = await pool.query(
    //     "SELECT word FROM wordle_game_guesses WHERE game_id = $1 ORDER BY timestamp ASC;",
    //     [sessionId]
    // );
    // return rows;
    const row = await pool.collection("wordle_games").aggregate(
        [
            {$match: {_id: new ObjectId(sessionId)}}, 
            {$project: {_id: 0, timestamp: 1,  guesses: {$sortArray: {input: "$guesses", sortBy: {timestamp: 1}}}}}
        ]
    ).toArray();
    const guesses = row[0].guesses;
    return guesses;
};

async function insertWordleGuess(sessionId, word) {
    // await pool.query(
    //     "INSERT INTO wordle_game_guesses (game_id, word) VALUES ($1, $2);",
    //     [sessionId, word]
    // );
    await pool.collection("wordle_games").findOneAndUpdate({_id: new ObjectId(sessionId)}, {
        $push: {guesses: {word: word, timestamp: new Date(Date.now())}}
    });
};

async function deleteOldWordleGames(currentDate) {
    // await pool.query(
    //     "DELETE FROM wordle_games WHERE timestamp < $1;",
    //     [currentDate]
    // );
    await pool.collection("wordle_games").deleteMany({timestamp: {$lt: currentDate}});
};

async function getWordFromAllWords(word) {
    // const {rows} = await pool.query("SELECT * FROM all_words WHERE word = $1", [word]);
    // let wordInfo = null;
    // if (rows.length !== 0) {
    //     wordInfo = rows[0];
    // }
    // return wordInfo;
    const row = await pool.collection("all_words").findOne({word: word});
    let wordInfo = (row) ? row : null;
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