import {
  TILE_SIZE,
  TILE_SHIFT,
  BG_BORDER,
  GAME_BG,
} from '../../utils/constants';
import {
  getRandomNum,
  loadImage,
  getTileArray,
  getCursorPosition,
  checkCoords,
} from '../../utils/helpers';

class Game {
  constructor({ N, M }) {
    this.N = N;
    this.M = M;
    this.tileSize = TILE_SIZE;
    this.tileShift = TILE_SHIFT;
    this.border = BG_BORDER;

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.canvas.width = this.N * this.tileSize + this.border * 2;
    this.canvas.height =
      this.M * this.tileSize + this.border * 2 + this.tileShift;

    this.bg = null;

    this.tiles = [];
    this.tilesCount = 0;
    this.tilesArr = [];

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

    this.tiles = await getTileArray();
    this.tilesCount = this.tiles.length - 1;

    for (let i = this.N - 1; i >= 0; i--) {
      const arr = [];

      for (let j = this.M - 1; j >= 0; j--) {
        const { name, image } = this.tiles[getRandomNum(0, this.tilesCount)];

        arr.push({
          name,
          image,
          x: i * this.tileSize + this.border,
          y: j * this.tileSize + this.border,
          width: this.tileSize,
          height: this.tileSize + this.tileShift,
        });
      }
      this.tilesArr.push(arr);
    }

    this.canvas.addEventListener('click', (event) => {
      const { x, y } = getCursorPosition(this.canvas, event);

      if (
        x > this.border &&
        x < this.canvas.width - this.border &&
        y > this.border + this.tileShift &&
        y < this.canvas.width - this.border + this.tileShift
      ) {
        const xPos = this.M - Math.floor((x - this.border) / this.tileSize) - 1;
        const yPos =
          this.N -
          Math.floor((y - this.border - this.tileShift) / this.tileSize) -
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
        if (this.tilesArr[i][j]) {
          const { image, x, y, width, height } = this.tilesArr[i][j];

          this.context.drawImage(image, x, y, width, height);
        }
      }
    }
  }

  delete(x, y) {
    const coordsArr = [];
    coordsArr.push({ x, y, isChecked: false });

    if (!this.tilesArr[x][y]) return;

    const { name } = this.tilesArr[x][y];
    let isAllFind = true;

    do {
      isAllFind = false;

      coordsArr.forEach(({ x, y, isChecked }, index) => {
        if (isChecked) return;

        if (x + 1 >= 0 && x + 1 < this.N) {
          if (
            this.tilesArr[x + 1][y] &&
            this.tilesArr[x + 1][y].name === name &&
            !checkCoords(coordsArr, x + 1, y)
          ) {
            coordsArr.push({ x: x + 1, y, isChecked: false });
            isAllFind = true;
          }
        }

        if (x - 1 >= 0 && x - 1 < this.N) {
          if (
            this.tilesArr[x - 1][y] &&
            this.tilesArr[x - 1][y].name === name &&
            !checkCoords(coordsArr, x - 1, y)
          ) {
            coordsArr.push({ x: x - 1, y, isChecked: false });
            isAllFind = true;
          }
        }

        if (y + 1 >= 0 && y + 1 < this.M) {
          if (
            this.tilesArr[x][y + 1] &&
            this.tilesArr[x][y + 1].name === name
          ) {
            if (!checkCoords(coordsArr, x, y + 1)) {
              coordsArr.push({ x, y: y + 1, isChecked: false });
              isAllFind = true;
            }
          }
        }

        if (y - 1 >= 0 && y - 1 < this.M) {
          if (
            this.tilesArr[x][y - 1] &&
            this.tilesArr[x][y - 1].name === name
          ) {
            if (!checkCoords(coordsArr, x, y - 1)) {
              coordsArr.push({ x, y: y - 1, isChecked: false });
              isAllFind = true;
            }
          }
        }

        coordsArr[index].isChecked = true;
      });
    } while (isAllFind);

    if (coordsArr.length > 1) {
      coordsArr.forEach(({ x, y }) => {
        this.tilesArr[x][y] = null;
      });
    }
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
