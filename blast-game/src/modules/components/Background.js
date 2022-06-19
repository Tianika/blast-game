import DisplayObject from './DisplayObject';

class Background extends DisplayObject {
  constructor(props = {}) {
    super(props);

    this.context = props.context;
  }

  draw() {}
}

export default Background;
