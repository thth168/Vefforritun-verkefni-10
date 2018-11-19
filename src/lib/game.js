import { empty, el } from './helpers';
import question from './question';
import Highscore, { score } from './highscore';
import { save } from './storage';

// allar breytur hér eru aðeins sýnilegar innan þessa módúl

let startButton; // takki sem byrjar leik
let problem; // element sem heldur utan um verkefni, sjá index.html
let answer; // element sem tekur á móti svari frá einstaklingnum.
let result; // element sem heldur utan um niðurstöðu, sjá index.html
let timer;
let resultText;
let questionContainer;
let input;
let resultForm;
let resultInput;

let playTime; // hversu lengi á að spila? Sent inn gegnum init()
let total = 0; // fjöldi spurninga í núverandi leik
let correct = 0; // fjöldi réttra svara í núverandi leik
let currentProblem; // spurning sem er verið að sýna
let points;

/**
 * Klárar leik. Birtir result og felur problem. Reiknar stig og birtir í result.
 */
function finish() {
  points = score(total, correct, playTime);
  const text = `Þú svaraðir ${correct} rétt af ${total} spurningum og fékkst ${points} stig fyrir. Skráðu þig á stigatöfluna!`;
  problem.classList.add('problem--hidden');
  result.classList.remove('result--hidden');
  empty(resultText);
  resultText.appendChild(el('p', text));
}

/**
 * Keyrir áfram leikinn. Telur niður eftir því hve langur leikur er og þegar
 * tími er búinn kallar í finish().
 *
 * Í staðinn fyrir að nota setInterval köllum við í setTimeout á sekúndu fresti.
 * Þurfum þá ekki að halda utan um id á intervali og skilum falli sem lokar
 * yfir fjölda sekúnda sem eftir er.
 *
 * @param {number} current Sekúndur eftir
 */
function tick(current) {
  empty(timer);
  timer.appendChild(document.createTextNode(current));
  if (current <= 0) {
    return finish();
  }
  return setTimeout(() => tick(current - 1), 1000);
}

/**
 * Býr til nýja spurningu og sýnir undir .problem__question
 */
function showQuestion() {
  currentProblem = question();
  empty(questionContainer);
  questionContainer.appendChild(document.createTextNode(currentProblem.problem));
}

/**
 * Byrjar leik
 *
 * - Felur startButton og sýnir problem
 * - Núllstillir total og correct
 * - Kallar í fyrsta sinn í tick()
 * - Sýnir fyrstu spurningu
 */
function start() {
  startButton.classList.add('button--hidden');
  problem.classList.remove('problem--hidden');
  total = 0;
  correct = 0;
  tick(playTime);
  showQuestion();
}

/**
 * Event handler fyrir það þegar spurningu er svarað. Athugar hvort svar sé
 * rétt, hreinsar input og birtir nýja spurningu.
 *
 * @param {object} e Event þegar spurningu svarað
 */
function onSubmit(e) {
  e.preventDefault();
  total += 1;
  if (Number(input.value) == currentProblem.answer && /\S/.test(input.value)) { /*eslint-disable-line*/
    correct += 1;
  }
  input.value = null;
  showQuestion();
}

/**
 * Event handler fyrir þegar stig eru skráð eftir leik.
 *
 * @param {*} e Event þegar stig eru skráð
 */
function onSubmitScore(e) {
  e.preventDefault();
  const highscore = new Highscore();
  save(resultInput.value, points);
  result.classList.add('result--hidden');
  problem.classList.add('problem--hidden');
  startButton.classList.remove('button--hidden');
  highscore.load();
}

/**
 * Finnur öll element DOM og setur upp event handlers.
 *
 * @param {number} _playTime Fjöldi sekúnda sem hver leikur er
 */
export default function init(_playTime) {
  playTime = _playTime;
  startButton = document.querySelector('.start');
  result = document.querySelector('.result');
  resultForm = document.querySelector('.result__form');
  resultText = document.querySelector('.result__text');
  resultInput = document.querySelector('.result__input');
  problem = document.querySelector('.problem');
  answer = document.querySelector('.problem__answer');
  timer = document.querySelector('.problem__timer');
  questionContainer = document.querySelector('.problem__question');
  input = document.querySelector('.problem__input');

  startButton.addEventListener('click', () => start());
  answer.addEventListener('submit', event => onSubmit(event), false);
  resultForm.addEventListener('submit', event => onSubmitScore(event));
}
