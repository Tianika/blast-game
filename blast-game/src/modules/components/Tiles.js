import DisplayObject from './DisplayObject';
import { checkCoords, getRandomNum } from '../../utils/helpers';
import EndScene from '../scenes/EndScene';
import { END_GAME_MAP } from '../../utils/constants';

class Tiles extends DisplayObject {
  constructor(props = {}) {
    super(props);

    this.columnCount = props.columnCount;
    this.rowCount = props.rowCount;
    this.tilesSample = props.tilesSample;
    this.tileSize = props.tileSize;
    this.border = props.border;
    this.tileShift = props.tileShift;
    this.context = props.context;
    this.minTilesGroup = props.minTilesGroup;

    this.allTiles = [];
    this.forAnimate = [];
    this.forDelete = [];
    this.forMove = [];

    this.isAnimation = false;
    this.shuffleAnimationDuration = 300;
    this.deleteAnimationDuration = 300;
    this.moveAnimationDuration = 100;
    this.animationTimeEnd = 0;
    this.moveTime = 0;

    this.shuffleCount = 2;

    this.endGame = new EndScene();
  }

  create() {
    for (let i = this.columnCount - 1; i >= 0; i--) {
      const arr = [];

      for (let j = this.rowCount - 1; j >= 0; j--) {
        arr.push(this.createTile(i, j));
      }

      this.allTiles.push(arr);
    }
    if (!this.checkPossibleMove()) {
      this.shuffleTiles();
      this.checkShuffleResult();
    }
  }

  createTile(column, row) {
    const { name, image } =
      this.tilesSample[getRandomNum(0, this.tilesSample.length - 1)];

    return {
      name,
      image,
      x: column * this.tileSize + this.border,
      y: row * this.tileSize + this.border,
      width: this.tileSize,
      height: this.tileSize + this.tileShift,
    };
  }

  draw() {
    for (let i = 0; i < this.columnCount; i++) {
      for (let j = 0; j < this.rowCount; j++) {
        if (this.allTiles[i][j]) {
          const { image, x, y, width, height } = this.allTiles[i][j];

          new DisplayObject({ image, x, y, width, height }).draw(this.context);
        }
      }
    }
  }

  findTiles(x, y) {
    const findedTiles = [];
    const coords = [];
    coords.push({ x, y, isChecked: false });

    if (!this.allTiles[x][y]) return;

    const { name } = this.allTiles[x][y];
    let isAllFind = true;

    do {
      isAllFind = false;

      coords.forEach(({ x, y, isChecked }, index) => {
        if (isChecked) return;

        if (x + 1 >= 0 && x + 1 < this.columnCount) {
          if (
            this.allTiles[x + 1][y] &&
            this.allTiles[x + 1][y].name === name &&
            !checkCoords(coords, x + 1, y)
          ) {
            coords.push({ x: x + 1, y, isChecked: false });
            isAllFind = true;
          }
        }

        if (x - 1 >= 0 && x - 1 < this.columnCount) {
          if (
            this.allTiles[x - 1][y] &&
            this.allTiles[x - 1][y].name === name &&
            !checkCoords(coords, x - 1, y)
          ) {
            coords.push({ x: x - 1, y, isChecked: false });
            isAllFind = true;
          }
        }

        if (y + 1 >= 0 && y + 1 < this.rowCount) {
          if (
            this.allTiles[x][y + 1] &&
            this.allTiles[x][y + 1].name === name
          ) {
            if (!checkCoords(coords, x, y + 1)) {
              coords.push({ x, y: y + 1, isChecked: false });
              isAllFind = true;
            }
          }
        }

        if (y - 1 >= 0 && y - 1 < this.rowCount) {
          if (
            this.allTiles[x][y - 1] &&
            this.allTiles[x][y - 1].name === name
          ) {
            if (!checkCoords(coords, x, y - 1)) {
              coords.push({ x, y: y - 1, isChecked: false });
              isAllFind = true;
            }
          }
        }

        coords[index].isChecked = true;
      });
    } while (isAllFind);

    coords.forEach(({ x, y }) => {
      findedTiles.push({ ...this.allTiles[x][y] });
    });

    return findedTiles.length >= this.minTilesGroup
      ? { findedTiles, coords }
      : null;
  }

  delete() {
    this.forDelete.forEach(({ x, y }) => {
      this.allTiles[x][y] = null;
    });

    this.forDelete = [];
  }

  animateDelete(timestamp) {
    if (Date.now() > this.animationTimeEnd) {
      this.forAnimate = [];
      this.isAnimation = false;
      this.move();
    }

    this.forAnimate = this.forAnimate.map(({ image, x, y, width, height }) => {
      new DisplayObject({ image, x, y, width, height }).draw(this.context);

      const widthResize = Math.ceil(
        (width / this.deleteAnimationDuration) * 15
      );
      const heightResize = Math.ceil(
        (height / this.deleteAnimationDuration) * 15
      );

      return {
        image,
        width: (width -= widthResize),
        height: (height -= heightResize),
        x: (x += widthResize / 2),
        y: (y += heightResize / 2),
      };
    });

    if (this.forAnimate.length) {
      this.isAnimation = true;

      requestAnimationFrame((time) => this.animateDelete(time));
    }
  }

  move() {
    for (let i = 0; i < this.columnCount; i++) {
      let time = 0;
      let index = 0;
      const arr = [];

      for (let j = 0; j < this.rowCount; j++) {
        const tile = this.allTiles[i][j];

        if (!tile) {
          time += 1;
        } else {
          const { name, image, x, y, width, height } = tile;

          arr.push({
            tile: {
              name,
              image,
              x,
              y,
              width,
              height,
            },
            timeAnimation: time,
          });
        }
      }

      while (index < time) {
        const { name, image, x, y, width, height } = this.createTile(
          this.columnCount - 1 - i,
          -1 - index
        );

        arr.push({
          tile: { name, image, x, y, width, height },
          timeAnimation: time,
        });

        index++;
      }
      this.moveTime = Math.max(this.moveTime, time);
      this.forMove.push(arr);
    }
  }

  animateMove() {
    if (this.forMove.length < 1) return;

    this.allTiles = [];
    for (let i = 0; i < this.columnCount; i++) {
      const arr = [];

      for (let j = 0; j < this.rowCount; j++) {
        const { tile, timeAnimation } = this.forMove[i][j];
        const { name, image, x, y, width, height } = tile;

        if (timeAnimation > 0) {
          this.forMove[i][j] = {
            tile: {
              name,
              image,
              x,
              y: y + this.tileSize,
              width,
              height,
            },
            timeAnimation: timeAnimation - 1,
          };
        }

        arr.push(this.forMove[i][j].tile);
      }

      this.allTiles.push(arr);
    }

    this.moveTime -= 1;

    if (!this.moveTime) {
      this.forMove = [];
      this.checkShuffleResult();
    }
  }

  checkPossibleMove() {
    let isPossible = false;

    for (let i = 0; i < this.allTiles.length; i++) {
      for (let j = 0; j < this.allTiles[i].length; j++) {
        const tiles = this.findTiles(i, j);

        if (tiles) {
          isPossible = true;
          break;
        }
      }
    }

    return isPossible;
  }

  shuffleTiles() {
    this.allTiles.sort(() => Math.random() - 0.5);

    this.allTiles.forEach((column) => {
      column.sort(() => Math.random() - 0.5);
    });

    for (let i = 0; i < this.columnCount; i++) {
      for (let j = 0; j < this.rowCount; j++) {
        this.allTiles[i][j].x =
          (this.columnCount - 1 - i) * this.tileSize + this.border;
        this.allTiles[i][j].y =
          (this.rowCount - 1 - j) * this.tileSize + this.border;
      }
    }

    this.shuffleCount -= 1;
  }

  checkShuffleResult() {
    if (this.shuffleCount > -1) {
      if (!this.checkPossibleMove()) {
        setTimeout(() => {
          this.shuffleTiles();
          this.checkShuffleResult();
        }, this.shuffleAnimationDuration);
      }
    } else {
      this.endGame.draw(END_GAME_MAP.lost);
    }
  }
}

export default Tiles;
