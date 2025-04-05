import wordsModule from './wordsModule.js';

let wpmText = document.getElementById("wpm");
let cpmText = document.getElementById("cpm");
let errorText = document.getElementById("errors");
let timerText = document.getElementById("time");
let accuracyText = document.getElementById("accuracy");
let defaultText = document.getElementById("default_text");
let inputArea = document.getElementById("input_area");
let restartButton = document.getElementById("restart_button");

let timeLimit = prompt("Time in s", 60);
let quantityWords = 50;
let wpm;
let cpm;
let timeLeft = timeLimit;
let timeElapsed = 0;
let timer = null;
let errors = 0;
let totalErrors = 0;
let characterTyped = 0;
let currentWords;
let currentInput;
let currentInputArray;
let cooldown = false;
let cooldownTime = 1000 * (timeLimit + 1);

document.addEventListener("keydown", function(event) {
  if (event.keyCode == 13 && !cooldown) {
    event.preventDefault();

    cooldown = true;

    resetValuesAll(); 
    updateText();
    inputArea.focus();

    setTimeout(() => {
      cooldown = false;
      console.log("cooldown ended");
  }, cooldownTime);
  }
});

inputArea.onfocus = function start() {
  resetValuesAll(); 
  updateText(); 
} 

function getRandomWords(array, items) {
  let copyArray = array.slice();

  // Fisher-Yates shuffle algorithm - GPT 3.5
  for (let i = copyArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copyArray[i], copyArray[j]] = [copyArray[j], copyArray[i]];
  };
  copyArray = copyArray.slice(0, items).join().replace(/,/g," ");
  return copyArray;
};

function updateText() {
  let wordsUsing = getRandomWords(wordsModule, quantityWords);
  defaultText.textContent = null;
  currentWords = wordsUsing;
  inputArea.placeholder = currentWords;
  currentWords.split('').forEach(character => {
    const characterElement = document.createElement('span');
    characterElement.innerText = character;
    defaultText.appendChild(characterElement);
  });
  timer = setInterval(updateTimer, 1000);
} 

inputArea.oninput = function processTypedTextbyUser() {
  currentInput = inputArea.value;
  currentInputArray = currentInput.split('');
  characterTyped++;
  errors = 0;
  cpm = Math.round(((characterTyped / timeElapsed) * 60));
  wpm = Math.round((((characterTyped / 6.4) / timeElapsed) * 60));
  cpmText.textContent = cpm;
  wpmText.textContent = wpm;
  let arrayTypedCharacter = defaultText.querySelectorAll('span');

  arrayTypedCharacter.forEach((character, num) => {
    let typedCharacter = currentInputArray[num];

    if (typedCharacter == null) {
      character.classList.remove('correct');
      character.classList.remove('incorrect');
      
    } else if (typedCharacter === character.innerText) {
      character.classList.add('correct');
      character.classList.remove('incorrect');

    } else {
      character.classList.remove('correct');
      character.classList.add('incorrect');

      errors++;
    };
  });

  errorText.textContent = totalErrors + errors;

  let correctCharacters = (characterTyped - (totalErrors + errors));
  let accuracyVal = ((correctCharacters / characterTyped) * 100);
  accuracyText.textContent = Math.round(accuracyVal);

  if (currentInput.length == currentWords.length) {
    updateText();

    totalErrors += errors;
    inputArea.value = "";
  };
};

function updateTimer() { 
  if (timeLeft > 0) { 
    timeLeft--; 
  
    timeElapsed++; 
  
    timerText.textContent = timeLeft + "s"; 
  } 
  else { 
    finishGame(); 
  };
};

restartButton.addEventListener("click", resetValuesAll);

function resetValuesAll() { 
  timeLeft = timeLimit; 
  timeElapsed = 0; 
  errors = 0; 
  totalErrors = 0; 
  characterTyped = 0;
  inputArea.disabled = false; 
  
  inputArea.value = ""; 
  wpmText.textContent = 0
  cpmText.textContent = 0
  defaultText.textContent = "";
  accuracyText.textContent = 100; 
  timerText.textContent = timeLeft + 's'; 
  errorText.textContent = 0; 
  defaultText.style.color = "rgb(94, 94, 94)";
  restartButton.style.display = "none";

  clearInterval(timer);
};

function finishGame() { 
  clearInterval(timer); 
  
  inputArea.disabled = true;
  defaultText.style.color = "rgb(60, 60, 60)";
  restartButton.style.display = "block"; 
};