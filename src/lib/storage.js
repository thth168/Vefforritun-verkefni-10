/**
 * Sækir og vistar í localStorage
 */

// Fast sem skilgreinir heiti á lykli sem vistað er undir í localStorage
const LOCALSTORAGE_KEY = 'calc_game_scores';

/**
 * Sækir gögn úr localStorage. Skilað sem röðuðum lista á forminu:
 * { points: <stig>, name: <nafn> }
 *
 * @returns {array} Raðað fylki af svörum eða tóma fylkið ef ekkert vistað.
 */

export function load() {
  let highscore = [];
  if (localStorage.getItem(LOCALSTORAGE_KEY)) {
    highscore = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));
  }
  return highscore;
}

/**
 * Vista stig
 *
 * @param {string} name Nafn þess sem á að vista
 * @param {number} points Stig sem á að vista
 */
export function save(name, points) {
  const highscore = load();
  const newScore = { name, points };
  highscore.push(newScore);
  highscore.sort((a, b) => a.points - b.points);

  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(highscore));
}

/**
 * Hreinsa öll stig úr localStorage
 */
export function clear() {
  localStorage.removeItem(LOCALSTORAGE_KEY);
}
