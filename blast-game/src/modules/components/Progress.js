import { createElementWithClass } from '../../utils/helpers';
import Game from './Game';

class Progress extends Game {
  constructor(props) {
    super(props);

    this.blockScore = createElementWithClass('div', 'blockScore');
  }

  draw() {
    const progress = createElementWithClass('div', 'gameProgress');
    progress.innerHTML = 'прогресс';

    const progressBarContainer = createElementWithClass(
      'div',
      'progressBarContainer'
    );
    progress.appendChild(progressBarContainer);

    const progressBar = createElementWithClass('div', 'progressBar');
    progressBarContainer.appendChild(progressBar);

    const gameMoves = createElementWithClass('div', 'gameMovesCount');
    gameMoves.innerHTML = this.gameMovesCount;

    const score = createElementWithClass('div', 'scoreCount');
    score.innerHTML = `ОЧКИ: <div>${this.scoreCount}</div>`;

    this.parent.appendChild(progress);

    this.blockScore.appendChild(gameMoves);
    this.blockScore.appendChild(score);
    this.parent.appendChild(this.blockScore);
  }
}

export default Progress;
