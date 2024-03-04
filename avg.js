import wordsModule from './wordsModule.js';

function calculateAverageWordLength(words) {
  const totalLength = words.reduce((sum, word) => sum + word.length, 0);
  const averageLength = totalLength / words.length;

  return averageLength;
}

const wordArray = wordsModule;
const averageLength = calculateAverageWordLength(wordArray);

console.log(averageLength);
// 6.416087388282026