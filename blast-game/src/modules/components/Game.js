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
      if (!this.tiles.isAnimation) {
        const { x, y } = getCursorPosition(this.canvas, event);

        if (
          x > this.border &&
          x < this.canvas.width - this.border &&
          y > this.border + this.tileShift &&
          y < this.canvas.width - this.border + this.tileShift
        ) {
          const xPos =
            this.M - Math.floor((x - this.border) / this.tileSize) - 1;
          const yPos =
            this.N -
            Math.floor((y - this.border - this.tileShift) / this.tileSize) -
            1;

          const tiles = this.tiles.findTiles(xPos, yPos);

          if (tiles) {
            this.tiles.forDelete = [...tiles.coords];
            this.tiles.forAnimate = [...tiles.findedTiles];

            this.tiles.animationTimeEnd =
              Date.now() + this.tiles.deleteAnimationDuration;

            this.tiles.delete();
            this.tiles.animateDelete();
          }
        }
      }
    });

    requestAnimationFrame((time) => this.render(time));
  }

  draw() {
    console.log('draw');

    this.background.draw();
    this.tiles.draw();
    this.tiles.animateMove();
  }

  render(timestamp) {
    requestAnimationFrame((time) => this.render(time));
    this.clearCanvas();
    this.draw();
  }
}

export default Game;
