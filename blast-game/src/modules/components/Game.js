import {
  TILE_SIZE,
  TILE_SHIFT,
  BG_BORDER,
  GAME_BG,
  END_GAME_MAP,
} from '../../utils/constants';
import {
  loadImage,
  getTileArray,
  getCursorPosition,
  createElementWithClass,
} from '../../utils/helpers';
import EndScene from '../scenes/EndScene';
import Background from './Background';
import Tiles from './Tiles';

class Game {
  constructor({ parentElement }) {
    this.parent = parentElement;

    this.columnCount = 8;
    this.rowCount = 10;
    this.scoreCount = 0;
    this.gameMovesCount = 20;
    this.minTilesGroup = 2;
    this.scoreForWin = Math.max(this.columnCount, this.rowCount) * 10;

    this.tileSize = TILE_SIZE;
    this.tileShift = TILE_SHIFT;
    this.border = BG_BORDER;

    this.canvas = createElementWithClass('canvas', 'canvas');
    this.context = this.canvas.getContext('2d');

    this.canvas.width = this.columnCount * this.tileSize + this.border * 2;
    this.canvas.height =
      this.rowCount * this.tileSize + this.border * 2 + this.tileShift;

    this.bgImage = null;
    this.background = null;

    this.tilesSample = [];
    this.tiles = null;

    this.endGame = new EndScene();
  }

  clearCanvas() {
    this.canvas.width = this.canvas.width;
  }

  async startGame() {
    this.parent.appendChild(this.canvas);

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
      columnCount: this.columnCount,
      rowCount: this.rowCount,
      tilesSample: this.tilesSample,
      tileSize: this.tileSize,
      border: this.border,
      tileShift: this.tileShift,
      context: this.context,
      minTilesGroup: this.minTilesGroup,
    });
    this.tiles.create();

    this.canvas.addEventListener('click', (event) => {
      if (!this.tiles.isAnimation) {
        const { x, y } = getCursorPosition(this.canvas, event);

        if (
          x > this.border &&
          x < this.canvas.width - this.border &&
          y > this.border + this.tileShift &&
          y < this.canvas.height - this.border + this.tileShift
        ) {
          const xPos =
            this.columnCount -
            Math.floor((x - this.border) / this.tileSize) -
            1;
          const yPos =
            this.rowCount -
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

            this.updateGameMoves();
            this.updateScore(tiles.findedTiles.length);

            if (this.scoreCount >= this.scoreForWin) {
              this.tiles.isAnimation = true;

              setTimeout(() => {
                this.endGame.draw(END_GAME_MAP.win);
              }, this.tiles.deleteAnimationDuration);
            }

            if (this.gameMovesCount === 0) {
              this.tiles.isAnimation = true;

              setTimeout(() => {
                this.endGame.draw(END_GAME_MAP.lost);
              }, this.tiles.deleteAnimationDuration);
            }
          }
        }
      }
    });

    requestAnimationFrame((time) => this.render(time));
  }

  draw() {
    this.background.draw();
    this.tiles.draw();
    this.tiles.animateMove();
  }

  render(timestamp) {
    requestAnimationFrame((time) => this.render(time));
    this.clearCanvas();
    this.draw();
  }

  updateGameMoves() {
    this.gameMovesCount -= 1;
    const gameMovesCount = document.querySelector('.gameMovesCount');

    gameMovesCount.innerHTML = this.gameMovesCount;
  }

  updateScore(score) {
    this.scoreCount += score;
    const scoreCount = document.querySelector('.scoreCount div');
    scoreCount.innerHTML = this.scoreCount;

    this.updateProgress();
  }

  updateProgress() {
    const progress = document.querySelector('.progressBar');

    progress.style.left = `${
      -100 +
      (Math.min(this.scoreCount, this.scoreForWin) / this.scoreForWin) * 100
    }%`;
  }
}

export default Game;
