const {MongoClient} = require("mongodb");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();


const client = new MongoClient(process.env.MONGODB_URL);


function getSchema() {
    const schemaPath = path.join(__dirname, "schema.json");
    const schema = fs.readFileSync(schemaPath, {encoding:"utf8"});
    const jsonSchema = JSON.parse(schema);
    return jsonSchema;
};


async function populateAllWordsCollection(db) {
    const allWordsPath = path.join(__dirname, "words.json");
    const fileContents = fs.readFileSync(allWordsPath);
    const words = JSON.parse(fileContents).words;

    const query = [];
    for (let word of words) {
        query.push({word: word});
    }

    await db.collection("all_words").insertMany(query);
};


async function main() {
    console.log("seeding...");

    const schema = getSchema();

    await client.connect();
    const db = client.db("wordle");
    await db.createCollection("all_words", {
        validator: {$jsonSchema: schema.all_words}
    });
    await db.createCollection("used_words", {
        validator: {$jsonSchema: schema.used_words}
    });
    await db.createCollection("wordle_games", {
        validator: {$jsonSchema: schema.wordle_games}
    });
    await populateAllWordsCollection(db);
    await client.close();
    
    console.log("done");
};



main();