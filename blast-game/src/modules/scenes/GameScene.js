import Game from '../components/Game';
import Scene from './Scene';

class GameScene extends Scene {
  constructor(props) {
    super(props);

    this.N = 10;
    this.M = 8;
  }

  async draw() {
    super.draw();

    const header = document.createElement('header');
    header.classList.add('gameHeader');
    header.innerHTML = 'header';
    this.scene.appendChild(header);

    const main = document.createElement('main');
    main.classList.add('gameMain');
    this.scene.appendChild(main);

    const game = new Game({
      columnCount: this.N,
      rowCount: this.M,
      parentElement: main,
    });
    await game.startGame();
  }
}

export default GameScene;
