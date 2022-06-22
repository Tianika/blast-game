import GameScene from '../scenes/GameScene';
import StartScene from '../scenes/StartScene';

class App {
  constructor() {}

  start() {
    const startScene = new GameScene();
    startScene.draw();
  }
}

export default App;
