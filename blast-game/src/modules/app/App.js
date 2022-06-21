import Game from '../components/Game';

class App {
  constructor() {
    this.N = 8;
    this.M = 10;
  }

  async start() {
    const game = new Game({ columnCount: this.N, rowCount: this.M });

    await game.startGame();
  }
}

export default App;
