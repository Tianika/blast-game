class DisplayObject {
  constructor(props) {
    this.image = props.image;
    this.x = props.x;
    this.y = props.y;
    this.width = props.width;
    this.height = props.height;
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

export default DisplayObject;
