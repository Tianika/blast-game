import { createElementWithClass } from '../../utils/helpers';
import Game from '../components/Game';
import Score from '../components/Score';
import Scene from './Scene';

class GameScene extends Scene {
  constructor(props) {
    super(props);
  }

  async draw() {
    super.draw();
    this.scene.classList.add('gameScene');

    const header = createElementWithClass('header', 'gameHeader');
    header.innerHTML = 'header';
    this.scene.appendChild(header);

    const main = createElementWithClass('main', 'gameMain');
    this.scene.appendChild(main);

    const game = new Game({
      parentElement: main,
    });
    await game.startGame();

    const score = new Score({
      parentElement: main,
    });
    score.draw();
  }
}

export default GameScene;
