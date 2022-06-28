import DisplayObject from './DisplayObject';

class Background extends DisplayObject {
  constructor(props = {}) {
    super(props);

    this.context = props.context;
  }

  draw() {
    super.draw(this.context);
  }
}

export default Background;
