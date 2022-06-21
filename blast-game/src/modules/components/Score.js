import Game from './Game';

class Score extends Game {
  constructor(props) {
    super(props);

    this.blockScore = document.createElement('div');
    this.blockScore.classList = 'blockScore';
  }

  draw() {
    this.parent.appendChild(this.blockScore);

    const gameMoves = document.createElement('div');
    gameMoves.classList = 'gameMoves';
    gameMoves.innerHTML = this.gameMoves;

    const score = document.createElement('div');
    score.classList = 'score';
    score.innerText = `ОЧКИ: 
                      ${this.score}`;

    this.blockScore.appendChild(gameMoves);
    this.blockScore.appendChild(score);
  }
}

export default Score;
