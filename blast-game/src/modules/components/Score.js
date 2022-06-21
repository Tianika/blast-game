import { createElementWithClass } from '../../utils/helpers';
import Game from './Game';

class Score extends Game {
  constructor(props) {
    super(props);

    this.blockScore = createElementWithClass('div', 'blockScore');
  }

  draw() {
    this.parent.appendChild(this.blockScore);

    const gameMoves = createElementWithClass('div', 'gameMoves');
    gameMoves.innerHTML = this.gameMoves;

    const score = createElementWithClass('div', 'score');
    score.innerText = `ОЧКИ: 
                      ${this.score}`;

    this.blockScore.appendChild(gameMoves);
    this.blockScore.appendChild(score);
  }
}

export default Score;
