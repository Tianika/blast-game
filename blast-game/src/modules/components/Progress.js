import { createElementWithClass } from '../../utils/helpers';
import { STRING_MAP } from '../../utils/locales';
import Game from './Game';

class Progress extends Game {
  constructor(props) {
    super(props);

    this.blockScore = createElementWithClass('div', 'blockScore');
  }

  draw() {
    const progress = createElementWithClass('h2', 'gameProgress');
    progress.innerHTML = STRING_MAP.progress;

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
    score.innerHTML = `${STRING_MAP.score} <div>${this.scoreCount}</div>`;

    this.parent.appendChild(progress);

    this.blockScore.appendChild(gameMoves);
    this.blockScore.appendChild(score);
    this.parent.appendChild(this.blockScore);
  }
}

export default Progress;
