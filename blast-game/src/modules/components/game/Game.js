class Game {
  constructor({ N, M }) {
    this.N = N;
    this.M = M;
    this.tailSize = 50;
    this.border = 20;

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.canvas.width = this.N * this.tailSize + this.border * 2;
    this.canvas.height = this.M * this.tailSize + this.border * 2;

    this.bg = new Image();
    this.bg.src = '../../assets/png/field.png';
  }

  draw() {
    const root = document.querySelector('#root');
    root.appendChild(this.canvas);

    this.bg.onload = () => {
      this.context.drawImage(
        this.bg,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    };
  }
}

export default Game;
