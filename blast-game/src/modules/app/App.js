import Game from '../components/Game';

class App {
  constructor() {
    this.N = 10;
    this.M = 8;
  }

  async start() {
    const game = new Game({ columnCount: this.N, rowCount: this.M });

    await game.startGame();
  }
}

export default App;
