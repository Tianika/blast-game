import {
  TAIL_SIZE,
  TAIL_SHIFT,
  BG_BORDER,
  GAME_BG,
} from '../../utils/constants';
import {
  getRandomNum,
  loadImage,
  getTailArray,
  getCursorPosition,
} from '../../utils/helpers';

class Game {
  constructor({ N, M }) {
    this.N = N;
    this.M = M;
    this.tailSize = TAIL_SIZE;
    this.tailShift = TAIL_SHIFT;
    this.border = BG_BORDER;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.canvas.width = this.N * this.tailSize + this.border * 2;
    this.canvas.height =
      this.M * this.tailSize + this.border * 2 + this.tailShift * 1.5;
  }

  clearCanvas() {
    this.canvas.width = this.canvas.width;
  }

  async draw() {
    const root = document.querySelector('#root');
    root.appendChild(this.canvas);

    const bg = await loadImage(GAME_BG);
    this.context.drawImage(bg, 0, 0, this.canvas.width, this.canvas.height);

    const tailsArr = [];

    const tails = await getTailArray();
    const tailsCount = tails.length - 1;

    for (let i = this.N - 1; i > -1; i--) {
      const arr = [];

      for (let j = this.M - 1; j > -1; j--) {
        const tail = tails[getRandomNum(0, tailsCount)];

        arr.push({
          tail,
          x: i * this.tailSize + this.border,
          y: j * this.tailSize + this.border,
          width: this.tailSize,
          height: this.tailSize + this.tailShift,
        });
      }
      tailsArr.push(arr);
    }

    for (let i = 0; i < this.N; i++) {
      for (let j = 0; j < this.M; j++) {
        const { tail, x, y, width, height } = tailsArr[i][j];

        this.context.drawImage(tail, x, y, width, height);
      }
    }

    this.canvas.addEventListener('click', (event) => {
      const { x, y } = getCursorPosition(this.canvas, event);

      if (
        x > this.border &&
        x < this.canvas.width - this.border &&
        y > this.border &&
        y < this.canvas.width - this.border
      ) {
        console.log(x, y);
      }
    });
  }
}

export default Game;
