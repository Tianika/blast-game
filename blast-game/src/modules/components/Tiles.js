import DisplayObject from './DisplayObject';
import { checkCoords, getRandomNum } from '../../utils/helpers';
import { MIN_TILES_GROUP } from '../../utils/constants';

class Tiles extends DisplayObject {
  constructor(props = {}) {
    super(props);

    this.N = props.N;
    this.M = props.M;
    this.tilesSample = props.tilesSample;
    this.tileSize = props.tileSize;
    this.border = props.border;
    this.tileShift = props.tileShift;
    this.context = props.context;

    this.tiles = [];
    this.forAnimate = [];
    this.forDelete = [];
    this.forMove = [];

    this.isAnimation = false;
    this.deleteAnimationDuration = 300;
    this.moveAnimationDuration = 100;
    this.animationTimeEnd = 0;
  }

  create() {
    for (let i = this.N - 1; i >= 0; i--) {
      const arr = [];

      for (let j = this.M - 1; j >= 0; j--) {
        arr.push(this.createTile(i, j));
      }

      this.tiles.push(arr);
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
    for (let i = 0; i < this.N; i++) {
      for (let j = 0; j < this.M; j++) {
        if (this.tiles[i][j]) {
          const { image, x, y, width, height } = this.tiles[i][j];

          new DisplayObject({ image, x, y, width, height }).draw(this.context);
        }
      }
    }
  }

  findTiles(x, y) {
    const findedTiles = [];
    const coords = [];
    coords.push({ x, y, isChecked: false });

    if (!this.tiles[x][y]) return;

    const { name } = this.tiles[x][y];
    let isAllFind = true;

    do {
      isAllFind = false;

      coords.forEach(({ x, y, isChecked }, index) => {
        if (isChecked) return;

        if (x + 1 >= 0 && x + 1 < this.N) {
          if (
            this.tiles[x + 1][y] &&
            this.tiles[x + 1][y].name === name &&
            !checkCoords(coords, x + 1, y)
          ) {
            coords.push({ x: x + 1, y, isChecked: false });
            isAllFind = true;
          }
        }

        if (x - 1 >= 0 && x - 1 < this.N) {
          if (
            this.tiles[x - 1][y] &&
            this.tiles[x - 1][y].name === name &&
            !checkCoords(coords, x - 1, y)
          ) {
            coords.push({ x: x - 1, y, isChecked: false });
            isAllFind = true;
          }
        }

        if (y + 1 >= 0 && y + 1 < this.M) {
          if (this.tiles[x][y + 1] && this.tiles[x][y + 1].name === name) {
            if (!checkCoords(coords, x, y + 1)) {
              coords.push({ x, y: y + 1, isChecked: false });
              isAllFind = true;
            }
          }
        }

        if (y - 1 >= 0 && y - 1 < this.M) {
          if (this.tiles[x][y - 1] && this.tiles[x][y - 1].name === name) {
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
      findedTiles.push(this.tiles[x][y]);
    });

    return findedTiles.length >= MIN_TILES_GROUP
      ? { findedTiles, coords }
      : { findedTiles: [], coords: [] };
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

  delete() {
    this.forDelete.forEach(({ x, y }) => {
      this.tiles[x][y] = null;
    });

    this.deleteTiles = [];
  }

  move() {
    for (let i = 0; i < this.N; i++) {
      let timeAnim = 0;
      let index = this.N - 1;
      const arr = [];

      for (let j = 0; j < this.M; j++) {
        const tile = this.tiles[i][j];

        if (tile) {
          const { name, image, x, y, width, height } = tile;

          arr.push({
            tile: {
              name,
              image,
              x,
              y: this.border + index * this.tileSize,
              width,
              height,
            },
            timeAnim,
          });
          index--;
        } else {
          timeAnim += this.moveAnimationDuration;
        }
      }

      while (index >= 0) {
        arr.push({
          tile: this.createTile(this.N - 1 - i, index),
          timeAnim,
        });

        timeAnim += this.moveAnimationDuration;
        index--;
      }

      this.forMove.push(arr);
    }

    this.tiles = [];
    this.forMove.forEach((row) => {
      const arr = [];

      row.forEach(({ tile }) => {
        arr.push(tile);
      });

      this.tiles.push(arr);
    });

    this.forMove = [];
  }

  animateMove() {}
}

export default Tiles;
