import { createElementWithClass } from '../../utils/helpers';
import Game from './Game';

class Progress extends Game {
  constructor(props) {
    super(props);

    this.blockScore = createElementWithClass('div', 'blockScore');
    this.parent.appendChild(this.blockScore);
  }

  draw() {
    const gameMoves = createElementWithClass('div', 'gameMovesCount');
    gameMoves.innerHTML = this.gameMovesCount;

    const score = createElementWithClass('div', 'scoreCount');
    score.innerHTML = `ОЧКИ: <div>${this.scoreCount}</div>`;

    this.blockScore.appendChild(gameMoves);
    this.blockScore.appendChild(score);
  }
}

export default Progress;
