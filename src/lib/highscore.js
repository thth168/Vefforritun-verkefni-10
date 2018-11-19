import { empty, el } from './helpers';
import { clear, load } from './storage';


/**
 * Reikna út stig fyrir svör út frá heildarfjölda svarað á tíma.
 * Ekki þarf að gera ráð fyrir hversu lengi seinasta spurning var sýnd. Þ.e.a.s.
 * stig verða alltaf reiknuð fyrir n-1 af n spurningum.
 *
 * @param {number} total Heildarfjöldi spurninga
 * @param {number} correct Fjöldi svarað rétt
 * @param {number} time Tími sem spurningum var svarað á í sekúndum
 *
 * @returns {number} Stig fyrir svör
 */
export function score(total, correct, time) {
  let points = ((correct / total) * (correct / total) + correct) * total / time;
  points = Math.round(points * 100);
  return points;
}

/**
 * Útbúa stigatöflu, sækir gögn í gegnum storage.js
 */
export default class Highscore {
  constructor() {
    this.scores = document.querySelector('.highscore__scores');
    this.button = document.querySelector('.highscore__button');

    this.button.addEventListener('click', this.clear.bind(this));
  }

  /**
   * Hlaða stigatöflu inn
   */
  load() {
    empty(this.scores);
    this.highscore(load());
  }

  /**
   * Hreinsa allar færslur úr stigatöflu, tengt við takka .highscore__button
   */
  clear() {
    clear();
    this.load();
  }

  /**
   * Hlaða inn stigatöflu fyrir gefin gögn.
   *
   * @param {array} data Fylki af færslum í stigatöflu
   */
  highscore(data) {
    this.data = data;
    if (this.data.length === 0) {
      this.scores.appendChild(el('p', document.createTextNode('Engin stig skráð')));
      this.button.classList.add('highscore__button--hidden');
      return;
    }
    this.button.classList.remove('highscore__button--hidden', false);
    this.list = el('ol');
    while (this.data.length > 0) {
      this.currScore = this.data.pop();
      this.points = el('p', `${this.currScore.points} stig`);
      this.points.classList.add('highscore__number');
      this.name = el('p', this.currScore.name);
      this.name.classList.add('highscore__name');
      this.list.appendChild(el('li', this.points, this.name));
    }
    this.scores.appendChild(this.list);
  }
}
