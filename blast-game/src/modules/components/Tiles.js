import DisplayObject from './DisplayObject';
import { getTileArrForDraw } from '../../utils/helpers';

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

  delete() {}
}

export default Tiles;
