const request = require('superagent');

async function generateUrl() {
  const numberOfWords = Math.ceil(Math.random() * 10);
  const randomWords = await request.get(`https://random-word-api.herokuapp.com/word?number=${numberOfWords}&swear=1`);

  const mappedWords = randomWords.body.map(word => word.charAt(0).toUpperCase() + word.slice(1));
  const mungedWords = mappedWords.join('-');

  console.log(mungedWords);

  return mungedWords;
}

module.exports = generateUrl;
