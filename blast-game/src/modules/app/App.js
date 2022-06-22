import StartScene from '../scenes/StartScene';

class App {
  constructor() {}

  start() {
    const startScene = new StartScene();
    startScene.draw();
  }
}

export default App;
