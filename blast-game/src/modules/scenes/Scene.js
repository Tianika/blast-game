import { createElementWithClass } from '../../utils/helpers';

class Scene {
  constructor() {
    this.root = document.querySelector('#root');
    this.scene = createElementWithClass('div', 'sceneWrapper');
  }

  clear() {
    this.scene.innerHTML = '';
    this.root.innerHTML = '';
  }

  draw() {
    this.clear();
    root.appendChild(this.scene);
  }
}

export default Scene;
