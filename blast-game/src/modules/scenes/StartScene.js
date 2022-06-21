import Game from '../components/Game';

class StartScene {
  constructor() {
    this.N = 10;
    this.M = 8;

    this.scene = document.createElement('div');
    this.scene.classList.add('startScene');
  }

  draw() {
    const button = document.createElement('button');
    button.classList.add('startGameBtn');
    button.innerHTML = 'Start game';
    this.scene.appendChild(button);

    button.addEventListener('click', async () => {
      const game = new Game({ columnCount: this.N, rowCount: this.M });
      await game.startGame();
    });

    const root = document.querySelector('#root');
    root.appendChild(this.scene);
  }
}

export default StartScene;
