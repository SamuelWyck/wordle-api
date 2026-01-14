const {Client} = require("pg");
const fs = require("node:fs");
const path = require("node:path");



function getAllWordsTableQuery() {
    const allwordsFilepath = path.join(__dirname, "./words.json");
    const allWords = fs.readFileSync(allwordsFilepath);
    let words = JSON.parse(allWords);
    words = words.words;

    const query = ["INSERT INTO all_words (word) VALUES "];
    for (let i = 0; i < words.length; i += 1) {
        let queryPart = null;
        if (i === words.length - 1) {
            queryPart = `('${words[i]}');`;
        } else {
            queryPart = `('${words[i]}'), `;
        }
        query.push(queryPart);
    }
    return query.join("");
};


async function main() {
    console.log("Seeding db...");

    const connectionStr = process.argv[2];
    const schemaFilePath = path.join(__dirname, "./schema.sql");
    
    const schema = fs.readFileSync(schemaFilePath, {encoding: "utf8"});
    const fillAllwords = getAllWordsTableQuery();
    const client = new Client({connectionString: connectionStr});
    await client.connect();
    await client.query(schema);
    await client.query(fillAllwords);
    await client.end();

    console.log("done");
};


main();