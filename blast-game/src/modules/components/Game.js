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
      this.M * this.tailSize + this.border * 2 + this.tailShift;

    this.bg = null;

    this.tails = [];
    this.tailsCount = 0;
    this.tailsArr = [];

    this.isLoading = false;

    requestAnimationFrame((time) => this.render(time));
  }

  clearCanvas() {
    this.canvas.width = this.canvas.width;
  }

  async start() {
    const root = document.querySelector('#root');
    root.appendChild(this.canvas);

    this.bg = await loadImage(GAME_BG);

    this.tails = await getTailArray();
    this.tailsCount = this.tails.length - 1;

    for (let i = this.N - 1; i >= 0; i--) {
      const arr = [];

      for (let j = this.M - 1; j >= 0; j--) {
        const tail = this.tails[getRandomNum(0, this.tailsCount)];

        arr.push({
          tail,
          x: i * this.tailSize + this.border,
          y: j * this.tailSize + this.border,
          width: this.tailSize,
          height: this.tailSize + this.tailShift,
        });
      }
      this.tailsArr.push(arr);
    }

    this.canvas.addEventListener('click', (event) => {
      const { x, y } = getCursorPosition(this.canvas, event);

      if (
        x > this.border &&
        x < this.canvas.width - this.border &&
        y > this.border + this.tailShift &&
        y < this.canvas.width - this.border + this.tailShift
      ) {
        const xPos = this.M - Math.floor((x - this.border) / this.tailSize) - 1;
        const yPos =
          this.N -
          Math.floor((y - this.border - this.tailShift) / this.tailSize) -
          1;

        this.delete(xPos, yPos);
      }
    });

    this.isLoading = true;
  }

  draw() {
    console.log('draw');

    this.context.drawImage(
      this.bg,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    for (let i = 0; i < this.N; i++) {
      for (let j = 0; j < this.M; j++) {
        const { tail, x, y, width, height } = this.tailsArr[i][j];

        if (tail) {
          this.context.drawImage(tail, x, y, width, height);
        }
      }
    }
  }

  delete(x, y) {
    this.tailsArr[x][y].tail = null;
  }

  render(timestamp) {
    requestAnimationFrame((time) => this.render(time));

    this.clearCanvas();
    if (this.isLoading) {
      const x = getRandomNum(0, 9);
      const y = getRandomNum(0, 9);

      this.draw();
    }
  }
}

export default Game;
