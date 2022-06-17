import {
  TAIL_SIZE,
  BG_BORDER,
  GAME_BG,
  TAIL_DATAS,
} from '../../../utils/constants';
import { getRandomNum, loadImage, getTailArray } from '../../../utils/helpers';

class Game {
  constructor({ N, M }) {
    this.N = N;
    this.M = M;
    this.tailSize = TAIL_SIZE;
    this.border = BG_BORDER;

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.canvas.width = this.N * this.tailSize + this.border * 2;
    this.canvas.height = this.M * this.tailSize + this.border * 2;
  }

  async draw() {
    const root = document.querySelector('#root');
    root.appendChild(this.canvas);

    const bg = await loadImage(GAME_BG);
    this.context.drawImage(bg, 0, 0, this.canvas.width, this.canvas.height);

    const tails = await getTailArray();
    const tailsCount = tails.length - 1;

    for (let i = 0; i < this.N; i++) {
      for (let j = 0; j < this.M; j++) {
        const tail = tails[getRandomNum(0, tailsCount)];

        this.context.drawImage(
          tail,
          i * this.tailSize + this.border,
          j * this.tailSize + this.border,
          this.tailSize,
          this.tailSize
        );
      }
    }
  }
}

export default Game;
