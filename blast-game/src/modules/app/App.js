import Game from '../components/Game';

class App {
  constructor() {
    this.N = 10;
    this.M = 10;
  }

  start() {
    const game = new Game({ N: this.N, M: this.M });

    game.draw();
  }
}

export default App;
