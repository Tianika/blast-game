import { createElementWithClass } from '../../utils/helpers';
import GameScene from './GameScene';
import Scene from './Scene';

class EndScene extends Scene {
  constructor(props) {
    super(props);

    this.messages = {
      win: `Поздравляем! <div>Вы выиграли!!!</div>`,
      lost: `Вы проиграли. <div>Попробуйте снова</div>`,
    };
  }

  draw(message) {
    super.draw();

    const resultMessage = createElementWithClass('div', 'resultMessage');
    resultMessage.innerHTML = this.messages[message];

    const button = createElementWithClass('button', 'startAgainBtn');
    button.innerHTML = 'Начать сначала';

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
