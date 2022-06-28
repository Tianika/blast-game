import { createElementWithClass } from '../../utils/helpers';
import { BUTTONS_TEXT } from '../../utils/locales';
import GameScene from './GameScene';
import Scene from './Scene';

class StartScene extends Scene {
  constructor(props) {
    super(props);
  }

  draw() {
    super.draw();

    const button = createElementWithClass('button', 'startGameBtn');
    button.innerHTML = BUTTONS_TEXT.startGame;

    button.addEventListener('click', async () => {
      const gameScene = new GameScene();
      gameScene.draw();
    });

    this.scene.classList.add('startScene');
    this.scene.appendChild(button);
  }
}

export default StartScene;
