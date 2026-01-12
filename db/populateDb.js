const {Client} = require("pg");
const fs = require("node:fs");
const path = require("node:path");



async function main() {
    console.log("Seeding db...");

    const connectionStr = process.argv[2];
    const schemaFilePath = path.resolve("./db/schema.sql");
    
    const schema = fs.readFileSync(schemaFilePath, {encoding: "utf8"});

    const client = new Client({connectionString: connectionStr});
    await client.connect();
    await client.query(schema);
    await client.end();

    console.log("done");
};


main();