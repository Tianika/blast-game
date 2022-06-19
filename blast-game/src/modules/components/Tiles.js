import DisplayObject from './DisplayObject';
import { checkCoords, getTileArrForDraw } from '../../utils/helpers';

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

  delete(x, y) {
    const coordsArr = [];
    coordsArr.push({ x, y, isChecked: false });

    if (!this.tiles[x][y]) return;

    const { name } = this.tiles[x][y];
    let isAllFind = true;

    do {
      isAllFind = false;

      coordsArr.forEach(({ x, y, isChecked }, index) => {
        if (isChecked) return;

        if (x + 1 >= 0 && x + 1 < this.N) {
          if (
            this.tiles[x + 1][y] &&
            this.tiles[x + 1][y].name === name &&
            !checkCoords(coordsArr, x + 1, y)
          ) {
            coordsArr.push({ x: x + 1, y, isChecked: false });
            isAllFind = true;
          }
        }

        if (x - 1 >= 0 && x - 1 < this.N) {
          if (
            this.tiles[x - 1][y] &&
            this.tiles[x - 1][y].name === name &&
            !checkCoords(coordsArr, x - 1, y)
          ) {
            coordsArr.push({ x: x - 1, y, isChecked: false });
            isAllFind = true;
          }
        }

        if (y + 1 >= 0 && y + 1 < this.M) {
          if (this.tiles[x][y + 1] && this.tiles[x][y + 1].name === name) {
            if (!checkCoords(coordsArr, x, y + 1)) {
              coordsArr.push({ x, y: y + 1, isChecked: false });
              isAllFind = true;
            }
          }
        }

        if (y - 1 >= 0 && y - 1 < this.M) {
          if (this.tiles[x][y - 1] && this.tiles[x][y - 1].name === name) {
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
        this.tiles[x][y] = null;
      });
    }
  }
}

export default Tiles;
