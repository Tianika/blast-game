import Game from '../components/Game';

class App {
  constructor() {
    this.N = 10;
    this.M = 10;
  }

  async start() {
    const game = new Game({ N: this.N, M: this.M });

    await game.startGame();
  }
}

export default App;
