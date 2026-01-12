const db = require("../db/queries.js");
const fs = require("node:fs/promises");
const path = require("node:path");
const randInt = require("./randInt.js");
const {DateTime} = require("luxon");



class WordManager {
    #wordsFilePath = path.join(__dirname, "../db/words.json");
    #timezone = process.env.TIMEZONE;
    
    
    async testGuess(word) {
        const wordOfTheDay = await this.getWordOfTheDay();

        const result = {};
        for (let idx = 0; idx < word.length; idx += 1) {
            let charScore = 0;

            const char = word.at(idx);
            if (wordOfTheDay.includes(char)) {
                charScore += 1;
            }
            if (wordOfTheDay.at(idx) === char) {
                charScore += 1;
            }
            
            result[idx] = {char, charScore};
        }
        
        return result;
    };
    
    async getWordOfTheDay() {
        const wordInfo = await db.getLastUsedWord();
        if (wordInfo === null) {
            return this.#chooseWordOfTheDay();
        }
        if (!this.#isTodaysWord(wordInfo)) {
            return this.#chooseWordOfTheDay();
        }
        return wordInfo.word;
    };

    async #chooseWordOfTheDay() {
        const unusedWords = await this.#getUnusedWords();
        const randIndex = randInt(0, unusedWords.length);
        const chosenWord = unusedWords[randIndex];

        const newWordInfo = await db.insertUsedWord(chosenWord);
        return newWordInfo.word;
    };

    #isTodaysWord(wordInfo) {
        const parsedDate = new Date(wordInfo.date_used);
        const wordDate = DateTime.fromJSDate(parsedDate).setZone(this.#timezone);
        const currentDate = DateTime.fromMillis(Date.now()).setZone(this.#timezone);
        return currentDate.hasSame(wordDate, "day");
    };
    
    async #getUnusedWords() {
        let [allWords, usedWords] = await Promise.all([
            fs.readFile(this.#wordsFilePath, {encoding: "utf8"}),
            db.getUsedWords()
        ]);
        allWords = JSON.parse(allWords).words;

        if (allWords.length === usedWords.length) {
            await db.resetUsedWords();
            return allWords;
        }
        
        const usedWordsSet = new Set(usedWords);
        const unusedWords = [];
        for (let word of allWords) {
            if (!usedWordsSet.has(word)) {
                unusedWords.push(word);
            }
        }

        return unusedWords;
    };
};



module.exports = new WordManager();