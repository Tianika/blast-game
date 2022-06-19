import {
  TILE_SIZE,
  TILE_SHIFT,
  BG_BORDER,
  GAME_BG,
} from '../../utils/constants';
import {
  loadImage,
  getTileArray,
  getCursorPosition,
  checkCoords,
} from '../../utils/helpers';
import Background from './Background';
import Tiles from './Tiles';

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

    this.bgImage = null;
    this.background = null;

    this.tilesSample = [];
    this.tiles = null;

    this.animationDuration = 300;
  }

  clearCanvas() {
    this.canvas.width = this.canvas.width;
  }

  async startGame() {
    const root = document.querySelector('#root');
    root.appendChild(this.canvas);

    this.bgImage = await loadImage(GAME_BG);
    this.tilesSample = await getTileArray();

    this.background = new Background({
      image: this.bgImage,
      x: 0,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height,
      context: this.context,
    });

    this.tiles = new Tiles({
      N: this.N,
      M: this.M,
      tilesSample: this.tilesSample,
      tileSize: this.tileSize,
      border: this.border,
      tileShift: this.tileShift,
      context: this.context,
    });
    this.tiles.create();

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

    requestAnimationFrame((time) => this.render(time));
  }

  draw() {
    console.log('draw');

    this.background.draw();
    this.tiles.draw();
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
    this.draw();
  }
}

export default Game;
