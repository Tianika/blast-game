import { createElementWithClass } from '../../utils/helpers';
import { BUTTONS_TEXT, END_GAME_MESSAGES } from '../../utils/locales';
import GameScene from './GameScene';
import Scene from './Scene';

class EndScene extends Scene {
  constructor(props) {
    super(props);

    this.messages = {
      win: END_GAME_MESSAGES.win,
      lost: END_GAME_MESSAGES.lost,
    };
  }

  draw(message) {
    super.draw();

    const resultMessage = createElementWithClass('div', 'resultMessage');
    resultMessage.innerHTML = this.messages[message];

    const button = createElementWithClass('button', 'startAgainBtn');
    button.innerHTML = BUTTONS_TEXT.endGame;

    button.addEventListener('click', async () => {
      const gameScene = new GameScene();
      gameScene.draw();
    });

    this.scene.classList.add('endScene');

    this.scene.appendChild(resultMessage);
    this.scene.appendChild(button);
  }
}

export default EndScene;
