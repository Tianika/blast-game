import { createElementWithClass } from '../../utils/helpers';
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
  }
}

export default GameScene;
