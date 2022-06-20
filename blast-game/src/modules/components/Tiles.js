import DisplayObject from './DisplayObject';
import { checkCoords, getTileArrForDraw } from '../../utils/helpers';
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

    this.isAnimation = false;
    this.animationDuration = 300;
    this.animationTimeEnd = 0;
  }

  create() {
    this.tiles = getTileArrForDraw(
      this.N,
      this.M,
      this.tilesSample,
      this.tileSize,
      this.border,
      this.tileShift
    );
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

  animate() {
    if (this.forAnimate.length) {
      this.isAnimation = true;
    }

    if (Date.now() > this.animationTimeEnd) {
      this.forAnimate = [];
      this.isAnimation = false;
    }

    this.forAnimate = this.forAnimate.map(({ image, x, y, width, height }) => {
      new DisplayObject({ image, x, y, width, height }).draw(this.context);

      const widthResize = Math.ceil((width / this.animationDuration) * 15);
      const heightResize = Math.ceil((height / this.animationDuration) * 15);

      return {
        image,
        width: (width -= widthResize),
        height: (height -= heightResize),
        x: (x += widthResize / 2),
        y: (y += heightResize / 2),
      };
    });
  }

  delete() {
    this.forDelete.forEach(({ x, y }) => {
      this.tiles[x][y] = null;
    });

    this.deleteTiles = [];
  }
}

export default Tiles;
