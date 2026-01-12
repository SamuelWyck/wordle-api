const asyncHandler = require("express-async-handler");
const {validationResult} = require("express-validator");
const {wordleWordGuessVal} = require("../utils/validator.js");



const wordGuessGet = asyncHandler(async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    res.end();
});



module.exports = {
    wordGuessGet: [
        wordleWordGuessVal,
        wordGuessGet
    ]
};