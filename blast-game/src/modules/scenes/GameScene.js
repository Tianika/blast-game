import { createElementWithClass } from '../../utils/helpers';
import Bonuses from '../components/Bonuses';
import Game from '../components/Game';
import Progress from '../components/Progress';
import Scene from './Scene';

class GameScene extends Scene {
  constructor(props) {
    super(props);
  }

  async draw() {
    super.draw();
    this.scene.classList.add('gameScene');

    const main = createElementWithClass('main', 'gameMain');
    this.scene.appendChild(main);

    const game = new Game({
      parentElement: main,
    });
    await game.startGame();

    const progress = new Progress({
      parentElement: main,
    });
    progress.draw();

    const bonuses = new Bonuses({
      parentElement: main,
    });
    bonuses.draw();
  }
}

export default GameScene;
