import Scene from './Scene';
import Game from '../components/Game';

class StartScene extends Scene {
  constructor(props) {
    super(props);

    this.N = 10;
    this.M = 8;
  }

  draw() {
    this.clear();
    super.draw();

    const button = document.createElement('button');
    button.classList.add('startGameBtn');
    button.innerHTML = 'Start game';

    button.addEventListener('click', async () => {
      const game = new Game({ columnCount: this.N, rowCount: this.M });
      await game.startGame();
    });

    this.scene.classList.add('startScene');
    this.scene.appendChild(button);
  }
}

export default StartScene;
