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
    this.bombRadius = 1;

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

    this.isBombActive = false;
    this.isTeleportActive = false;

    this.teleportFirstPos = null;
    this.teleportSecondPos = null;

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
      if (this.tiles.isAnimation) return;

      if (this.isBombActive && event.target.classList.contains('canvas')) {
        this.activateBomb(event);
      } else if (this.isTeleportActive) {
        this.activateTeleport(event);
      } else {
        this.findTilesForRemove(event);
      }
    });

    this.activateBonuses();

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

  findTilesForRemove(event) {
    const { x, y } = getCursorPosition(this.canvas, event);

    if (
      x > this.border &&
      x < this.canvas.width - this.border &&
      y > this.border + this.tileShift &&
      y < this.canvas.height - this.border + this.tileShift
    ) {
      const { xPos, yPos } = this.getTilePosition(x, y);
      const tiles = this.tiles.findTiles(xPos, yPos);

      if (tiles) {
        this.tiles.forDelete = [...tiles.coords];
        this.tiles.forAnimate = [...tiles.findedTiles];

        this.gameProgress(tiles.findedTiles.length);
      }
    }
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

  activateBonuses() {
    const bomb = document.querySelector('.bombButton');
    const teleport = document.querySelector('.teleportButton');

    bomb.addEventListener('click', () => {
      if (bomb.classList.contains('active')) {
        this.isBombActive = true;
        this.isTeleportActive = false;
      } else {
        this.isBombActive = false;
      }
    });

    teleport.addEventListener('click', () => {
      if (teleport.classList.contains('active')) {
        this.isTeleportActive = true;
        this.isBombActive = false;
      } else {
        this.isTeleportActive = false;
      }
    });
  }

  activateBomb(event) {
    const bomb = document.querySelector('.bombButton');
    const { x, y } = getCursorPosition(this.canvas, event);

    if (
      x > this.border &&
      x < this.canvas.width - this.border &&
      y > this.border + this.tileShift &&
      y < this.canvas.height - this.border + this.tileShift
    ) {
      const { xPos, yPos } = this.getTilePosition(x, y);

      const columnStart = Math.max(xPos - this.bombRadius, 0);
      const columnEnd = Math.min(xPos + this.bombRadius, this.columnCount - 1);

      const rowStart = Math.max(yPos - this.bombRadius, 0);
      const rowEnd = Math.min(yPos + this.bombRadius, this.rowCount - 1);

      const tiles = [];
      const coords = [];

      for (let i = columnStart; i <= columnEnd; i++) {
        for (let j = rowStart; j <= rowEnd; j++) {
          coords.push({ x: i, y: j });
          tiles.push(this.tiles.allTiles[i][j]);
        }
      }

      this.tiles.forDelete = coords;
      this.tiles.forAnimate = tiles;

      this.gameProgress(tiles.length);
      this.isBombActive = false;
      bomb.classList.remove('active');
    }
  }

  activateTeleport(event) {
    const teleport = document.querySelector('.teleportButton');
    const { x, y } = getCursorPosition(this.canvas, event);

    if (
      x > this.border &&
      x < this.canvas.width - this.border &&
      y > this.border + this.tileShift &&
      y < this.canvas.height - this.border + this.tileShift
    ) {
      const { xPos, yPos } = this.getTilePosition(x, y);

      if (!this.teleportFirstPos) {
        this.teleportFirstPos = { x: xPos, y: yPos };
      } else if (!this.teleportSecondPos) {
        if (
          JSON.stringify(this.teleportFirstPos) !==
          JSON.stringify({ x: xPos, y: yPos })
        ) {
          this.teleportSecondPos = { x: xPos, y: yPos };

          const { x: x1, y: y1 } = this.teleportFirstPos;
          const { x: x2, y: y2 } = this.teleportSecondPos;

          this.tiles.forDelete = [
            this.teleportFirstPos,
            this.teleportSecondPos,
          ];

          const firstTile = { ...this.tiles.allTiles[x1][y1] };
          const secondTile = { ...this.tiles.allTiles[x2][y2] };

          this.tiles.delete();

          this.tiles.allTiles[x1][y1] = {
            name: secondTile.name,
            image: secondTile.image,
            x: firstTile.x,
            y: firstTile.y,
            width: firstTile.width,
            height: firstTile.height,
          };
          this.tiles.allTiles[x2][y2] = {
            name: firstTile.name,
            image: firstTile.image,
            x: secondTile.x,
            y: secondTile.y,
            width: secondTile.width,
            height: secondTile.height,
          };

          this.isTeleportActive = false;
          this.teleportFirstPos = false;
          this.teleportSecondPos = false;
          teleport.classList.remove('active');

          this.updateGameMoves();
          this.checkEndGame();
        }
      }
    }
  }

  getTilePosition(x, y) {
    const xPos =
      this.columnCount - Math.floor((x - this.border) / this.tileSize) - 1;
    const yPos =
      this.rowCount -
      Math.floor((y - this.border - this.tileShift) / this.tileSize) -
      1;

    return { xPos, yPos };
  }

  gameProgress(score) {
    this.tiles.animationTimeEnd =
      Date.now() + this.tiles.deleteAnimationDuration;

    this.tiles.delete();
    this.tiles.animateDelete();
    this.updateGameMoves();
    this.updateScore(score);
    this.checkEndGame();
  }

  checkEndGame() {
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

export default Game;
