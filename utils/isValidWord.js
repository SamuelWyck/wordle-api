async function isValidWord(word) {
    const url = `${process.env.WORD_CHECK_API_URL}/${word}?key=${process.env.WORD_CHECK_API_KEY}`;
    const res = await fetch(url);
    const parsedRes = await res.json();

    if (parsedRes.length === 0) {
        return false;
    }
    const firstResult = parsedRes[0];
    return typeof firstResult !== "string";
};



module.exports = isValidWord;