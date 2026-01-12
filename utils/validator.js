const {param} = require("express-validator");



const wordleWordGuessVal = [
    param("word").trim()
        .notEmpty().withMessage("Missing word param.")
        .isLength({min: 5, max: 5}).withMessage("Word guess must be five letters.")
];



module.exports = {
    wordleWordGuessVal
};