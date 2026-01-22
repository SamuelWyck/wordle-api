const {MongoClient} = require("mongodb");



const client = new MongoClient(process.env.MONGODB_URL);
const database = client.db("wordle");



module.exports = database;

// const {Pool} = require("pg");



// const pool = new Pool({
//     connectionString: process.env.DB_CONNECTION_URL
// });



// module.exports = pool;